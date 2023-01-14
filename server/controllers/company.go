package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Company(router fiber.Router) {

	company := router.Group("company")

	// Manage Company
	company.Post("/", handlers.CreateCompany)
	company.Get("/:id", handlers.GetCompany)
	company.Put("/:id", handlers.UpdateCompany)
	company.Delete("/:id", handlers.DeleteCompany)

	// Manage Company Users
	company.Get("/:id/user", handlers.GetUsersByCompany)
	company.Put("/:id/user", handlers.UpdateCompanyUsers)
	company.Delete("/:id/user/:userId", handlers.RemoveUserFromCompany)
	company.Post("/:id/user/invite", handlers.InviteUserToCompany)
	company.Post("/:id/user/invite/:code", handlers.AddNewUserToCompany)
	company.Put("/:id/user/invite/:code", handlers.AddExistingUserToCompany)

	// Manage Company Locations
	company.Delete("/:id/location", handlers.DeleteCompanyLocation)

	// Manage Company Services
	company.Get("/:id/service", handlers.GetCompanyServices)
	company.Post("/:id/service", handlers.CreateCompanyServices)

	// Manage Company Invoices
	company.Get("/:id/invoice", handlers.GetCompanyInvoices)

	// Manage Leads Assigned to Company
	company.Get("/:id/leads/:date", handlers.GetCompanyLeadsByDate)
	company.Get("/:id/leads", handlers.GetCompanyLeads)
}
