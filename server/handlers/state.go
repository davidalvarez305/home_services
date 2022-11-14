package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func GetAllStates(c *fiber.Ctx) error {
	states := &actions.States{}

	err := states.GetAllStates()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not query states.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": states,
	})
}
