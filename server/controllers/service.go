package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Service(router fiber.Router) {

	service := router.Group("service")

	service.Get("/", handlers.GetAllServices)
}
