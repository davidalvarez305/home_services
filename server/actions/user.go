package actions

import (
	"context"
	"encoding/base64"
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
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
)

type User struct {
	*models.User
}

func (user *User) Save() error {
	result := database.DB.Save(&user).First(&user)

	return result.Error
}

func (user *User) Logout(c *fiber.Ctx) error {
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	err = sess.Destroy()

	return err
}

func (user *User) Delete() error {
	result := database.DB.Delete(&user)

	return result.Error
}

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

	// Create with default account status being inactive.
	user.UserAccountStatus = append(user.UserAccountStatus, &models.UserAccountStatus{
		UserID:          user.ID,
		AccountStatusID: 2,
		CreatedAt:       time.Now().Unix(),
		UpdatedAt:       time.Now().Unix(),
	})

	err = user.Save()
	return err
}

func (user *User) UpdateUser(body User) error {

	user.Username = body.Username
	user.Email = body.Email
	user.APIToken = utils.GenerateAPIToken(user.Email + user.Password)
	user.UpdatedAt = time.Now().Unix()

	err := user.Save()

	return err
}

func (user *User) GetUserById(userId string) error {
	result := database.DB.Where("id = ?", userId).First(&user)

	return result.Error
}

func GetUserIdFromSession(c *fiber.Ctx) (string, error) {
	var userId string
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return userId, err
	}

	uId := sess.Get("userId")

	if uId == nil {
		return userId, errors.New("user not found")
	}

	userId = fmt.Sprintf("%v", uId)

	return userId, nil
}

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

func (user *User) RequestChangePasswordCode() error {
	var token Token

	err := token.GenerateToken(user)

	if err != nil {
		return err
	}

	err = user.SendGmail(token.UUID)

	if err != nil {
		return err
	}

	return nil
}

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

func (user *User) SendGmail(uuidCode string) error {

	// Load & Read Credentials From Credentials JSON File
	ctx := context.Background()
	googlePath := os.Getenv("GOOGLE_JSON_PATH")
	path, err := utils.ResolveServerPath()

	if err != nil {
		return err
	}

	b, err := os.ReadFile(path + "/" + googlePath)

	if err != nil {
		return err
	}

	// Create OAuth2 Pointer Config Struct
	config, err := google.ConfigFromJSON(b, gmail.GmailSendScope)
	if err != nil {
		return err
	}

	// Refresh Token
	token, err := utils.RefreshAuthToken()

	if err != nil {
		return err
	}

	// Initialize Client & Service With Credentials
	client := config.Client(context.Background(), token)

	srv, err := gmail.NewService(ctx, option.WithHTTPClient(client))

	if err != nil {
		return err
	}

	// Craft & Send Message
	from := os.Getenv("GMAIL_EMAIL")
	to := user.Email
	title := "Change Password Request"
	message := fmt.Sprintf("Click to change your password: %s", os.Getenv("CLIENT_URL")+"/token/"+uuidCode)

	msgStr := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", from, to, title, message)

	msg := []byte(msgStr)

	gMessage := &gmail.Message{Raw: base64.URLEncoding.EncodeToString(msg)}

	_, err = srv.Users.Messages.Send("me", gMessage).Do()

	if err != nil {
		return err
	}

	return nil
}

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
