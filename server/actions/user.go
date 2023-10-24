package actions

import (
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/sessions"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// Persist users to database & returns the newly created user.
func SaveUser(user models.User) (models.User, error) {
	var newUser models.User
	err := database.DB.Save(&user).First(&newUser).Error
	return newUser, err
}

// Destroy session.
func UserLogout(c *fiber.Ctx) error {
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	err = sess.Destroy()

	return err
}

// Delete user.
func DeleteUser(user models.User) error {
	return database.DB.Delete(&user).Error
}

// Create new user and set default account status to inactive.
func CreateUser(user models.User) (models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		return user, err
	}

	rightNow := time.Now().Unix()

	// Set user fields
	user.Password = string(hashedPassword)
	user.APIToken = utils.GenerateAPIToken(user.Email + user.Password)
	user.CreatedAt = rightNow
	user.UpdatedAt = rightNow
	user.AccountStatusID = 2
	user.RoleID = 2
	user.CompanyID = nil

	fmt.Printf("USER IS HERE: %+v\n", user)

	createdUser, err := SaveUser(user)

	if err != nil {
		return user, err
	}

	return createdUser, err
}

// Update and return updated user.
func UpdateUser(userId string, body models.User) (models.User, error) {
	user, err := GetUserById(userId)

	if err != nil {
		return user, err
	}

	user.Username = body.Username
	user.Email = body.Email
	user.UpdatedAt = time.Now().Unix()
	user.FirstName = body.FirstName
	user.LastName = body.LastName
	user.JobTitle = body.JobTitle
	user.PhoneNumber = body.PhoneNumber

	return SaveUser(user)
}

// Takes user ID as string value and returns the user from the database.
func GetUserById(userId string) (models.User, error) {
	var user models.User
	err := database.DB.Where("id = ?", userId).First(&user).Error
	return user, err
}

// Takes user email as string value and returns the user from the database.
func GetUserByEmail(email string) (models.User, error) {
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error
	return user, err
}

// Grabs userId from session, and then performs select query from the database.
func GetUserFromSession(c *fiber.Ctx) (models.User, error) {
	var user models.User
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return user, err
	}

	userId := sess.Get("userId")

	if userId == nil {
		return user, errors.New("user not found")
	}

	uId := fmt.Sprintf("%v", userId)

	return GetUserById(uId)
}

// Create new session with user.
func Login(user models.User, c *fiber.Ctx) (models.User, error) {
	userPassword := user.Password
	result := database.DB.Where("email = ?", user.Email).First(&user)

	if result.Error != nil {
		return user, errors.New("incorrect username")
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userPassword))

	if err != nil {
		return user, errors.New("incorrect password")
	}

	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return user, err
	}

	sess.Set("userId", user.ID)

	err = sess.Save()

	return user, err
}

// Generates new token to ensure that user at least has access to the user's e-mail.
func RequestChangePasswordCode(user models.User) error {
	token, err := generateToken(user.ID)

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
func ChangePassword(user models.User, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	user.APIToken = utils.GenerateAPIToken(user.Email + user.Password)
	user.UpdatedAt = time.Now().Unix()

	_, err = SaveUser(user)

	return err
}

// Takes form data from the client, and sends it to S3 bucket using AWS SDK v2.
func ChangeProfilePicture(user models.User, file *multipart.FileHeader) error {

	contents, err := file.Open()

	if err != nil {
		return err
	}

	var fileName = utils.GenerateFileName(file.Filename)

	err = utils.UploadImageToS3(contents, fileName, "profile-pictures")

	if err != nil {
		return err
	}

	user.ProfileImage = fileName
	user.UpdatedAt = time.Now().Unix()

	_, err = SaveUser(user)

	if err != nil {
		return err
	}

	return nil
}

// Get all users that belong to a company
func GetUsersByCompany(companyId int) ([]models.User, error) {
	var users []models.User
	err := database.DB.Where("company_id = ?", companyId).Find(&users).Error
	return users, err
}

// Set company and role ID's to zero
func RemoveUserFromCompany(companyId, userId string) error {
	var user models.User

	err := database.DB.Where("id = ? AND company_id = ?", userId, companyId).First(&user).Error

	if err != nil {
		return err
	}

	// Fetch company to ensure that there's at least another owner.
	var companyOwners []models.User
	err = database.DB.Where("company_id = ? AND role_id = 1", companyId).Find(&companyOwners).Error

	if err != nil {
		return err
	}

	if len(companyOwners) < 2 {
		return errors.New("cannot delete user, there must be at least one other owner")
	}

	// If user does not belong to a company, role_id is also null
	user.CompanyID = nil
	user.RoleID = 0
	user.UpdatedAt = time.Now().Unix()

	_, err = SaveUser(user)

	return err
}

// Set company and role ID's to zero
func UpdateCompanyUser(companyId, userId string, clientInput models.User) ([]models.User, error) {
	var user models.User
	var updatedUsers []models.User

	err := database.DB.Where("company_id = ? AND id = ?", companyId, userId).Find(&user).Error

	if err != nil {
		return updatedUsers, err
	}

	// Match client input users to DB users and adjust RoleID & AccountStatusID based on the form values
	if clientInput.ID == user.ID {
		user.RoleID = clientInput.RoleID
		user.AccountStatusID = clientInput.AccountStatusID
		user.UpdatedAt = time.Now().Unix()
	}

	err = database.DB.Save(&user).Where("company_id = ? AND id = ?", companyId, userId).Find(&updatedUsers).Error

	return updatedUsers, err
}

func CheckCanAcceptInvitation(user models.User, companyId string, companyToken models.CompanyToken) bool {

	// Token expires after 5 minutes.
	if time.Now().Unix()-companyToken.CreatedAt > 300 {
		err := DeleteCompanyToken(companyToken)
		if err != nil {
			return false
		}
		return false
	}

	// Check that user from session's e-mail and user from token's e-mail are the same
	if companyToken.Email != user.Email {
		return false
	}

	// Check that company in resource path is the same as both the one associated with the token, and the current user
	if companyId != fmt.Sprintf("%+v", user.CompanyID) || companyId != fmt.Sprintf("%+v", companyToken.CompanyID) {
		return false
	}

	return true
}

func GetCompanyOwners(companyId string) ([]models.User, error) {
	var users []models.User
	err := database.DB.Where("company_id = ? AND role_id = 1", companyId).Find(&users).Error
	return users, err
}
