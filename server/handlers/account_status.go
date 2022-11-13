package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func GetAllAccountStatus(c *fiber.Ctx) error {
	accountStatuses := &actions.AccountStatuses{}

	err := accountStatuses.GetAll()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not query account status fields.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": accountStatuses,
	})
}
