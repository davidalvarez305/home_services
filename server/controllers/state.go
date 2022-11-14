package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func State(router fiber.Router) {

	state := router.Group("state")

	state.Get("/", handlers.GetAllStates)
}
