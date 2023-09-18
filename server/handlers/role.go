package handlers

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/gofiber/fiber/v2"
)

func GetAllRoles(c *fiber.Ctx) error {
	var roles []models.Role

	err := database.DB.Find(&roles).Error

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not query roles.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": roles,
	})
}
