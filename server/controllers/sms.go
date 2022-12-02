package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func SMS(router fiber.Router) {

	sms := router.Group("sms")

	sms.Post("/", handlers.HandleIncomingMMS)
}
