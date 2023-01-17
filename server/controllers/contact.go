package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Contact(router fiber.Router) {

	contact := router.Group("contact")

	contact.Post("/", handlers.ContactForm)
}
