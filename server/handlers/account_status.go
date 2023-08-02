package handlers

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/gofiber/fiber/v2"
)

func GetAllAccountStatus(c *fiber.Ctx) error {
	var accountStatuses []*models.AccountStatus

	err := database.DB.Find(&accountStatuses).Error

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Could not query account status fields.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": accountStatuses,
	})
}
