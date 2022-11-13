package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/gofiber/fiber/v2"
)

func AccountStatus(router fiber.Router) {

	accountStatus := router.Group("account-status")

	accountStatus.Get("/", handlers.GetAllAccountStatus)
}
