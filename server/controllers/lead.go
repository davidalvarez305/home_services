package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Lead(router fiber.Router) {

	lead := router.Group("lead")

	lead.Post("/", handlers.CreateLead)                // Create lead
	lead.Get("/", handlers.GetLeadFromSession)         // Query user
	lead.Post("/login", handlers.LeadLogin)            // Login portal for leads
	lead.Post("/login/:code", handlers.CheckLoginCode) // Check login code sent from client
	lead.Put("/:id/code", handlers.RecoverUUIDCode)    // Recover UUID Code if Lost

	// Lead Specific Endpoints
	lead.Get("/:id", handlers.GetLeadInfo)   // Query user
	lead.Put("/:id", handlers.UpdateLead)    // Update profile
	lead.Delete("/:id", handlers.DeleteLead) // Delete account
	lead.Post("/:id", handlers.LeadLogout)   // Logout

	// Lead Quotes
	lead.Post("/:id/quote", handlers.CreateQuote) // Create a quote from user profile

	// Lead Quotes Detail
	lead.Get("/:id/quote/:quoteId", handlers.GetQuotesByLead)    // Get quote details
	lead.Delete("/:id/quote/:quoteId", handlers.DeleteLeadQuote) // Delete a quote

	// Lead Quotes Actions
	lead.Put("/:id/quote/:quoteId/address/:addressId", handlers.UpdateQuoteAddress)     // Update address attached to a lead's quote.
	lead.Post("/:id/quote/:quoteId/photo", handlers.AddQuotePhotos)                     // Add photo(s) attached to a lead's quote.
	lead.Delete("/:id/quote/:quoteId/photo/:photoId", handlers.DeleteQuotePhoto)        // Delete photo(s) attached to a lead's quote.
	lead.Post("/:id/quote/:quoteId/service", handlers.AddQuoteServices)                 // Add service(s) attached to a lead's quote.
	lead.Delete("/:id/quote/:quoteId/service/:serviceId", handlers.DeleteQuoteServices) // Delete service(s) attached to a lead's quote.

	// Lead logs
	lead.Post("/:id/log", handlers.CreateLog)    // Log user activity
	lead.Get("/:id/log", handlers.GetLogsByLead) // Query user activity
}
