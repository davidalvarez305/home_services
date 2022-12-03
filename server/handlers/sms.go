package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func HandleIncomingMMS(c *fiber.Ctx) error {
	input := &actions.TwillioWebhookRequestBody{}

	err := c.BodyParser(input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	err = input.UploadImagesFromMMS()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not save images.",
		})
	}

	err = input.SendSMS("Your images have been uploaded successfully! 📷")

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not send confirmation message.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "Message sent succesfully.",
	})
}
