package handlers

import (
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/gofiber/fiber/v2"
)

func ContactForm(c *fiber.Ctx) error {
	form := &types.ContactForm{}

	err := c.BodyParser(&form)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	message := form.Message
	email := form.Email
	title := "Contact Form Submission"

	err := utils.SendGmail(message, email, title)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Failed to send e-mail message.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "Message sent successfully.",
	})
}