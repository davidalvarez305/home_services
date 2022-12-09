package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Stripe(router fiber.Router) {

	stripe := router.Group("stripe")

	stripe.Get("/", handlers.HandleStripeWebhooks)
}
