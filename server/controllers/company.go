package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Company(router fiber.Router) {

	company := router.Group("company")

	company.Post("/", handlers.CreateCompany)
	company.Put("/", handlers.UpdateCompany)
	company.Delete("/", handlers.DeleteCompany)

	// Manage Company Users
	company.Get("/:id/user", handlers.GetUsersByCompany)
	company.Delete("/:id/user", handlers.RemoveUserFromCompany)
	company.Post("/:id/invite", handlers.InviteUserToCompany)
	company.Post("/:id/invite/:code", handlers.AddUserToCompany)

	// Manage Company Locations
	company.Delete("/:id/location", handlers.DeleteLocation)
}
