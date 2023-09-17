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

	// Set user fields
	user.Password = string(hashedPassword)
	user.APIToken = utils.GenerateAPIToken(user.Email + user.Password)
	user.CreatedAt = time.Now().Unix()
	user.UpdatedAt = time.Now().Unix()
	user.AccountStatusID = 2

	createdUser, err := SaveUser(user)

	if err != nil {
		return user, err
	}

	return createdUser, err
}

// Update and return updated user.
func UpdateUser(body models.User) (models.User, error) {
	var user models.User

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
func getUserById(userId string) (models.User, error) {
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

	return getUserById(uId)
}

// Create new session with user.
func Login(c *fiber.Ctx) (models.User, error) {
	var user models.User

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

// Check that user can mutate company attributes
func CheckUserPermission(c *fiber.Ctx, companyId string) (bool, error) {

	cId, err := strconv.Atoi(companyId)

	if err != nil {
		return false, err
	}

	user, err := GetUserFromSession(c)

	if err != nil {
		return false, err
	}

	// Assert that (A) the user is an owner, and (B) that the company being updated belongs to that user.
	return user.RoleID == 1 && user.CompanyID == cId, nil
}

// Set company and role ID's to zero
func RemoveUserFromCompany(companyId, userId string) error {
	var user models.User

	result := database.DB.Where("id = ? AND company_id = ?", userId, companyId).First(&user)

	if result.Error != nil {
		return result.Error
	}

	// Fetch company to ensure that there's at least another owner.
	var companyOwners []models.User
	res := database.DB.Where("company_id = ? AND role_id = 1", companyId).Find(&companyOwners)

	if res.Error != nil {
		return res.Error
	}

	if len(companyOwners) < 2 {
		return errors.New("cannot delete user, there must be at least one other owner")
	}

	// If user does not belong to a company, role_id is also null
	user.CompanyID = 0
	user.RoleID = 0
	user.UpdatedAt = time.Now().Unix()

	_, err := SaveUser(user)

	return err
}

// Set company and role ID's to zero
func UpdateCompanyUsers(companyId string, clientInput []models.User) ([]models.User, error) {
	var users []models.User

	err := database.DB.Where("company_id = ?", companyId).Find(&users).Error

	if err != nil {
		return users, err
	}

	// Match client input users to DB users and adjust RoleID & AccountStatusID based on the form values
	for _, user := range users {
		for _, input := range clientInput {
			if input.ID == user.ID {
				user.RoleID = input.RoleID
				user.AccountStatusID = input.AccountStatusID
				user.UpdatedAt = time.Now().Unix()
			}
		}
	}

	var updatedUsers []models.User

	err = database.DB.Where("company_id = ?", companyId).Save(&users).Find(&updatedUsers).Error

	return updatedUsers, err
}

// Check for user invite permissions
func CheckInvitePermissions(user models.User, companyId string, clientEmail string) bool {

	// Check that user has permission to invite
	if user.RoleID != 1 {
		return false
	}

	// Check that user company && companyId from URL are EQUAL
	if companyId != fmt.Sprintf("%+v", user.CompanyID) {
		return false
	}

	// User cannot invite themselves
	if user.Email == clientEmail {
		return false
	}

	return true
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
