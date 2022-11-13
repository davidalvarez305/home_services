package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Role(router fiber.Router) {

	role := router.Group("role")

	role.Get("/", handlers.GetAllRoles)
}
