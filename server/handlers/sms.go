package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/gofiber/fiber/v2"
)

func HandleIncomingMMS(c *fiber.Ctx) error {
	var body types.TwillioWebhookRequestBody

	err := c.BodyParser(&body)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	err = actions.UploadImagesFromMMS(&body)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not send SMS.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "Message sent succesfully.",
	})
}
