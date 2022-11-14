package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Location(router fiber.Router) {

	location := router.Group("location")

	location.Get("/", handlers.GetAllLocations)
}
