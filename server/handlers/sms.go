package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func HandleIncomingSMS(c *fiber.Ctx) error {
	err := actions.SendSMS("Hey there")

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not send SMS.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "Message sent succesfully.",
	})
}
