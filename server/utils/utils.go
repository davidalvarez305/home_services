package utils

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"os/user"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
)

func GetIds(arr string) ([]int, error) {
	var ids []int
	idList := strings.Split(arr, ",")
	for _, i := range idList {
		j, err := strconv.Atoi(i)
		if err != nil {
			return ids, err
		}
		ids = append(ids, j)
	}
	return ids, nil
}

func GenerateAPIToken(str string) string {
	keys := str + fmt.Sprintf("%+v", time.Now().Unix())
	hash, err := bcrypt.GenerateFromPassword([]byte(keys), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	return base64.StdEncoding.EncodeToString(hash)
}

func ResolveServerPath() (string, error) {
	var p string

	if os.Getenv("APP_ENV") == "production" {
		return ".", nil
	}

	u, err := user.Current()

	if err != nil {
		return p, err
	}

	p = u.HomeDir + os.Getenv("SERVER_PATH")

	return p, nil
}

// Sends generate token e-mail using the Gmail API.
func SendGmail(message, email, title string) error {

	// Load & Read Credentials From Credentials JSON File
	ctx := context.Background()
	googlePath := os.Getenv("GOOGLE_JSON_PATH")
	path, err := ResolveServerPath()

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
	token, err := RefreshAuthToken()

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
	to := email

	msgStr := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", from, to, title, message)

	msg := []byte(msgStr)

	gMessage := &gmail.Message{Raw: base64.URLEncoding.EncodeToString(msg)}

	_, err = srv.Users.Messages.Send("me", gMessage).Do()

	if err != nil {
		return err
	}

	return nil
}
