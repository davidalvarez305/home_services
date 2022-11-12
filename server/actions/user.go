package actions

import (
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"strconv"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/sessions"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	*models.User
}

type Users []*models.User

// Persist user to database.
func (user *User) Save() error {
	result := database.DB.Save(&user).First(&user)

	return result.Error
}

// Destroy session.
func (user *User) Logout(c *fiber.Ctx) error {
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	err = sess.Destroy()

	return err
}

// Delete user.
func (user *User) Delete() error {
	result := database.DB.Delete(&user)

	return result.Error
}

// Create new user and set default account status to inactive.
func (user *User) CreateUser() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	// Set user fields
	user.Password = string(hashedPassword)
	user.APIToken = utils.GenerateAPIToken(user.Email + user.Password)
	user.CreatedAt = time.Now().Unix()
	user.UpdatedAt = time.Now().Unix()
	user.AccountStatusID = 2

	err = user.Save()

	if err != nil {
		return err
	}

	return err
}

// Update and return updated user.
func (user *User) UpdateUser(body User) error {

	user.Username = body.Username
	user.Email = body.Email
	user.APIToken = utils.GenerateAPIToken(user.Email + user.Password)
	user.UpdatedAt = time.Now().Unix()

	err := user.Save()

	return err
}

// Takes user ID as string value and returns the user from the database.
func (user *User) GetUserById(userId string) error {
	result := database.DB.Where("id = ?", userId).First(&user)

	return result.Error
}

// Takes user email as string value and returns the user from the database.
func (user *User) GetUserByEmail(email string) error {
	result := database.DB.Where("email = ?", email).First(&user)

	return result.Error
}

// Grabs userId from session, and then performs select query from the database.
func (user *User) GetUserFromSession(c *fiber.Ctx) error {
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	userId := sess.Get("userId")

	if userId == nil {
		return errors.New("user not found")
	}

	uId := fmt.Sprintf("%v", userId)

	err = user.GetUserById(uId)

	return err
}

// Create new session with user.
func (user *User) Login(c *fiber.Ctx) error {
	userPassword := user.Password
	result := database.DB.Where("email = ?", user.Email).First(&user)

	if result.Error != nil {
		return errors.New("incorrect username")
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userPassword))

	if err != nil {
		return errors.New("incorrect password")
	}

	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	sess.Set("userId", user.ID)

	err = sess.Save()

	return err
}

// Generates new token to ensure that user at least has access to the user's e-mail.
func (user *User) RequestChangePasswordCode() error {
	var token Token

	err := token.GenerateToken(user)

	if err != nil {
		return err
	}

	title := "Change Password Request"
	message := fmt.Sprintf("Click to change your password: %s", os.Getenv("CLIENT_URL")+"/token/"+token.UUID)
	err = utils.SendGmail(message, user.Email, title)

	if err != nil {
		return err
	}

	return nil
}

// Verifies that user clicked the generated token with 5 minutes, and then saves the password sent from client.
func (user *User) ChangePassword(password string) error {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	user.APIToken = utils.GenerateAPIToken(user.Email + user.Password)
	user.UpdatedAt = time.Now().Unix()

	err = user.Save()

	return err
}

// Takes form data from the client, and sends it to S3 bucket using AWS SDK v2.
func (user *User) ChangeProfilePicture(file *multipart.FileHeader) error {

	fileName, err := utils.UploadImageToS3(file)

	if err != nil {
		return err
	}

	user.ProfileImage = fileName
	user.UpdatedAt = time.Now().Unix()

	err = user.Save()

	if err != nil {
		return err
	}

	return nil
}

// Get all users that belong to a company
func (users *Users) GetUsersByCompany(companyId int) error {
	return database.DB.Where("company_id = ?", companyId).Find(&users).Error
}

// Check that user can mutate company attributes
func (user *User) CheckUserPermission(c *fiber.Ctx, companyId string) (bool, error) {

	cId, err := strconv.Atoi(companyId)

	if err != nil {
		return false, err
	}

	err = user.GetUserFromSession(c)

	if err != nil {
		return false, err
	}

	// Assert that (A) the user is an owner, and (B) that the company being updated belongs to that user.
	return user.RoleID == 1 && user.CompanyID == cId, nil
}

// Set company and role ID's to zero
func (user *User) RemoveUserFromCompany(companyId, userId string) error {

	result := database.DB.Where("user_id = ? AND company_id = ?", userId, companyId).First(&user)

	if result.Error != nil {
		return result.Error
	}

	// If user does not belong to a company, role_id is also null
	user.CompanyID = 0
	user.RoleID = 0
	user.UpdatedAt = time.Now().Unix()

	return user.Save()
}

// Set company and role ID's to zero
func (user *User) UpdateCompanyUser(companyId, userId string, input *models.User) error {

	result := database.DB.Where("user_id = ? AND company_id = ?", userId, companyId).First(&user)

	if result.Error != nil {
		return result.Error
	}

	// If user does not belong to a company, role_id is also null
	user.RoleID = int(input.RoleID)
	user.AccountStatusID = int(input.AccountStatusID)
	user.UpdatedAt = time.Now().Unix()

	return user.Save()
}
