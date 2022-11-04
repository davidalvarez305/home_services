package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Company(router fiber.Router) {

	company := router.Group("company")

	company.Get("/", handlers.GetCompanyDetails)
	company.Put("/", handlers.UpdateCompany)
	company.Post("/", handlers.CreateCompany)
}