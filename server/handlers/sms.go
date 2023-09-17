package handlers

import (
	"fmt"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func HandleIncomingMMS(c *fiber.Ctx) error {
	var input actions.TwillioWebhookRequestBody

	err := c.BodyParser(input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	lead, err := actions.GetLeadByPhoneNumber(input.From)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find lead by phone number.",
		})
	}

	err = actions.UploadImagesFromMMS(lead, input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not save images.",
		})
	}

	err = actions.SendSMS("Your images have been uploaded successfully! 📷", input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not send confirmation message.",
		})
	}

	err = actions.SaveLeadLog("Images added through text.", fmt.Sprintf("%+v", lead.ID))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not save lead activity.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "Message sent succesfully.",
	})
}
