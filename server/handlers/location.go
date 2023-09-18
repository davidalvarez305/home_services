package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/gofiber/fiber/v2"
)

func GetAllLocations(c *fiber.Ctx) error {
	stateId := c.Query("stateId")

	if len(stateId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Include state in query string.",
		})
	}

	locations, err := actions.GetAllLocations(stateId)

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
	var states []models.State
	err := database.DB.Find(&states).Error

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not query states.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": states,
	})
}
