package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Company(router fiber.Router) {

	company := router.Group("company")

	// Manage Company
	company.Post("/", handlers.CreateCompany)
	company.Put("/:id", handlers.UpdateCompany)
	company.Delete("/:id", handlers.DeleteCompany)

	// Manage Company Users
	company.Get("/:id/user", handlers.GetUsersByCompany)
	company.Put("/:id/user/:userId", handlers.UpdateCompanyUser)
	company.Delete("/:id/user/:userId", handlers.RemoveUserFromCompany)
	company.Post("/:id/user/invite", handlers.InviteUserToCompany)
	company.Post("/:id/user/invite/:code", handlers.AddUserToCompany)

	// Manage Company Locations
	company.Delete("/:id/location", handlers.DeleteLocation)
}
