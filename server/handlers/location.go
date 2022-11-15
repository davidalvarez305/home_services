package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func GetAllLocations(c *fiber.Ctx) error {
	locations := &actions.Locations{}

	stateId := c.Query("stateId")

	if len(stateId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Include state in query string.",
		})
	}

	err := locations.GetAllLocations(stateId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not query locations.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": locations,
	})
}

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
