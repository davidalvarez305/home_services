package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func Invoice(router fiber.Router) {

	invoice := router.Group("invoice")

	invoice.Post("/:companyId", handlers.CreateInvoice)
	invoice.Get("/:companyId", handlers.GetInvoices)
}
