package handlers

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/gofiber/fiber/v2"
)

func GetAllServices(c *fiber.Ctx) error {
	var services []models.Service
	err := database.DB.Find(&services).Error

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not query services.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": services,
	})
}
