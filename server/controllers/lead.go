package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Lead(router fiber.Router) {

	lead := router.Group("lead")

	lead.Post("/", handlers.CreateLead)                // Create lead
	lead.Get("/", handlers.GetLeadFromSession)         // Query user
	lead.Post("/logout", handlers.LeadLogout)          // Logout
	lead.Post("/login", handlers.LeadLogin)            // Login portal for leads
	lead.Post("/login/code", handlers.RecoverUUIDCode) // Recover UUID Code if Lost
	lead.Post("/login/:code", handlers.CheckLoginCode) // Check login code sent from client

	// Lead Specific Endpoints
	lead.Get("/:id", handlers.GetLeadInfo)                        // Query user
	lead.Put("/:id", handlers.UpdateLead)                         // Update profile
	lead.Delete("/:id", handlers.DeleteLead)                      // Delete account
	lead.Post("/:id/photo", handlers.AddLeadPhotos)               // Add photo(s) attached to a lead's quote.
	lead.Delete("/:id/photo/:imageUrl", handlers.DeleteLeadPhoto) // Delete photo(s) attached to a lead's quote.

	// Lead logs
	lead.Post("/:id/log", handlers.CreateLog)    // Log user activity
	lead.Get("/:id/log", handlers.GetLogsByLead) // Query user activity
}
