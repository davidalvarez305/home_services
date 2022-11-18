package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Lead(router fiber.Router) {

	lead := router.Group("lead")

	lead.Post("/", handlers.CreateLead)
}
