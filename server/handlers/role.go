package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func GetAllRoles(c *fiber.Ctx) error {
	roles, err := actions.GetAll()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not query roles.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": roles,
	})
}
