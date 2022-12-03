package actions

import (
	"errors"
	"fmt"
	"os"

	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

// https://www.twilio.com/docs/messaging/guides/webhook-request
type TwillioWebhookRequestBody struct {
	MessageSid          string `json:"MessageSid"`
	SmsSid              string `json:"SmsSid"`
	AccountSid          string `json:"AccountSid"`
	MessagingServiceSid string `json:"MessagingServiceSid"`
	From                string `json:"From"`
	To                  string `json:"To"`
	Body                string `json:"Body"`
	NumMedia            int    `json:"NumMedia"`
	ReferralNumMedia    string `json:"ReferralNumMedia"`
	MediaContentType0   string `json:"MediaContentType0"`
	MediaUrl0           string `json:"MediaUrl0"`
	MediaContentType1   string `json:"MediaContentType1"`
	MediaUrl1           string `json:"MediaUrl1"`
	MediaContentType2   string `json:"MediaContentType2"`
	MediaUrl2           string `json:"MediaUrl2"`
	MediaContentType3   string `json:"MediaContentType3"`
	MediaUrl3           string `json:"MediaUrl3"`
	MediaContentType4   string `json:"MediaContentType4"`
	MediaUrl4           string `json:"MediaUrl4"`
	MediaContentType5   string `json:"MediaContentType5"`
	MediaUrl5           string `json:"MediaUrl5"`
	MediaContentType6   string `json:"MediaContentType6"`
	MediaUrl6           string `json:"MediaUrl6"`
	MediaContentType7   string `json:"MediaContentType7"`
	MediaUrl7           string `json:"MediaUrl7"`
	MediaContentType8   string `json:"MediaContentType8"`
	MediaUrl8           string `json:"MediaUrl8"`
	MediaContentType9   string `json:"MediaContentType9"`
	MediaUrl9           string `json:"MediaUrl9"`
	MediaContentType10  string `json:"MediaContentType10"`
	MediaUrl10          string `json:"MediaUrl10"`
}

func (msg *TwillioWebhookRequestBody) SendSMS(sms string) error {
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})

	params := &openapi.CreateMessageParams{}
	params.SetTo(msg.From)
	params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
	params.SetBody(sms)

	_, err := client.Api.CreateMessage(params)

	return err
}

func (msg *TwillioWebhookRequestBody) UploadImagesFromMMS() error {
	var uploadImages []string

	images := []string{msg.MediaUrl0, msg.MediaUrl1, msg.MediaUrl2, msg.MediaUrl3, msg.MediaUrl4, msg.MediaUrl5, msg.MediaUrl6, msg.MediaUrl7, msg.MediaUrl8, msg.MediaUrl9, msg.MediaUrl10}

	// First try to see if user is valid before trying to upload anything.
	q := Quote{}

	err := q.GetQuoteByPhoneNumber(msg.From)

	if err != nil {
		return err
	}

	for _, img := range images {

		// Only upload images where the MediaURL is not empty
		if len(img) > 0 {

			var fileName = utils.GenerateFileName("file.jpg")
			path, err := utils.ResolveServerPath()

			var fullPath = path + "/uploads/" + fileName

			if err != nil {
				fmt.Printf("%+v\n", err)
				continue
			}

			err = utils.GetImageFromURL(img, fullPath)

			if err != nil {
				fmt.Printf("%+v\n", err)
				continue
			}

			file, err := os.Open(fullPath)

			if err != nil {
				fmt.Printf("%+v\n", err)
				continue
			}

			err = utils.UploadImageToS3(file, fileName, "lead-photos")

			if err != nil {
				fmt.Printf("%+v\n", err)
				continue
			}

			// Save the FILE NAME in the DB, not the FULL LOCAL PATH
			uploadImages = append(uploadImages, fileName)
		}
	}

	if len(uploadImages) == 0 {
		return errors.New("no images sent in message")
	}

	var quotePhotos QuotePhotos

	for _, img := range uploadImages {
		quotePhotos = append(quotePhotos, &models.QuotePhoto{
			ImageURL: img,
			QuoteID:  q.ID,
		})
	}

	return quotePhotos.Save()
}
