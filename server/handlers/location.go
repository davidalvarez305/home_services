package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func GetAllLocations(c *fiber.Ctx) error {
	locations := &actions.Locations{}

	err := locations.GetAllLocations()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not query locations.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": locations,
	})
}
