package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Lead(router fiber.Router) {

	lead := router.Group("lead")

	lead.Post("/", handlers.CreateLead)     // Create lead
	lead.Post("/login", handlers.LeadLogin) // Login portal for leads

	// Lead Specific Endpoints
	lead.Get("/:id", handlers.GetLeadInfo)   // Query user
	lead.Put("/:id", handlers.UpdateLead)    // Update profile
	lead.Delete("/:id", handlers.DeleteLead) // Delete account
	lead.Post("/:id", handlers.LeadLogout)   // Logout

	// Lead Quotes
	lead.Get("/:id/quote", handlers.GetQuotesByLead) // Query all quotes created by a lead
	lead.Post("/:id/quote", handlers.CreateQuote)    // Create a quote from user profile

	// Lead Quotes Detail
	lead.Get("/:id/quote/:quoteId", handlers.GetQuotesByLead)    // Get quote details
	lead.Put("/:id/quote/:quoteId", handlers.UpdateLeadQuote)    // Update profile -> upload photos, etc.
	lead.Delete("/:id/quote/:quoteId", handlers.DeleteLeadQuote) // Delete a quote

	// Lead logs
	lead.Post("/:id/log", handlers.CreateLog)    // Log user activity
	lead.Get("/:id/log", handlers.GetLogsByLead) // Query user activity
}
