package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/davidalvarez305/home_services/server/middleware"
	"github.com/gofiber/fiber/v2"
)

func Company(router fiber.Router) {
	company := router.Group("company")

	// Manage Company
	company.Post("/", handlers.CreateCompany)
	company.Get("/:id", middleware.CompanyResourceAccessRestriction(handlers.GetCompany))
	company.Put("/:id", middleware.CompanyResourceAccessRestriction(handlers.UpdateCompany))
	company.Delete("/:id", middleware.CompanyResourceAccessRestriction(handlers.DeleteCompany))

	// Manage Company Users
	company.Get("/:id/user", middleware.CompanyResourceAccessRestriction(handlers.GetUsersByCompany))
	company.Put("/:id/user", middleware.CompanyResourceAccessRestriction(handlers.UpdateCompanyUsers))
	company.Delete("/:id/user/:userId", middleware.CompanyResourceAccessRestriction(handlers.RemoveUserFromCompany))
	company.Post("/:id/user/invite", middleware.CompanyResourceAccessRestriction(handlers.InviteUserToCompany))
	company.Post("/:id/user/invite/:code", middleware.CompanyResourceAccessRestriction(handlers.AddNewUserToCompany))
	company.Put("/:id/user/invite/:code", middleware.CompanyResourceAccessRestriction(handlers.AddExistingUserToCompany))

	// Manage Company Locations
	company.Delete("/:id/location", middleware.CompanyResourceAccessRestriction(handlers.DeleteCompanyLocation))

	// Manage Company Services
	company.Get("/:id/service", middleware.CompanyResourceAccessRestriction(handlers.GetCompanyServices))
	company.Post("/:id/service", middleware.CompanyResourceAccessRestriction(handlers.CreateCompanyServices))

	// Manage Company Invoices
	company.Get("/:id/invoice", middleware.CompanyResourceAccessRestriction(handlers.GetCompanyInvoices))

	// Manage Leads Assigned to Company
	company.Get("/:id/leads/:date", middleware.CompanyResourceAccessRestriction(handlers.GetCompanyLeadsByDate))
	company.Get("/:id/leads", middleware.CompanyResourceAccessRestriction(handlers.GetCompanyLeads))
}
