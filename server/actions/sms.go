package actions

import (
	"fmt"
	"os"

	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

func SendSMS(sms string) error {
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})

	params := &openapi.CreateMessageParams{}
	params.SetTo(os.Getenv("TO_PHONE_NUMBER"))
	params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
	params.SetBody(sms)

	_, err := client.Api.CreateMessage(params)

	return err
}

func UploadImagesFromMMS(msg *types.TwillioWebhookRequestBody) error {
	var uploadImages []string

	images := []string{msg.MediaUrl0, msg.MediaUrl1, msg.MediaUrl2, msg.MediaUrl3, msg.MediaUrl4, msg.MediaUrl5, msg.MediaUrl6, msg.MediaUrl7, msg.MediaUrl8, msg.MediaUrl9, msg.MediaUrl10}

	for _, img := range images {
		imageToUpload, err := utils.GetImageFromURL(img)

		if err != nil {
			fmt.Printf("%+v\n", err)
			continue
		}

		var fileName = utils.GenerateFileName("file.jpg")

		err = utils.UploadImageToS3(imageToUpload, fileName)

		if err != nil {
			fmt.Printf("%+v\n", err)
			continue
		}

		uploadImages = append(uploadImages, fileName)
	}

	// Save images to the quote
	q := Quote{}

	err := q.GetQuoteByPhoneNumber(msg.From)

	if err != nil {
		return err
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
