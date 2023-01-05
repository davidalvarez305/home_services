package routes

import (
	"github.com/davidalvarez305/home_services/server/controllers"
	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App) {
	// , middleware.AuthMiddleware
	api := app.Group("api")
	controllers.User(api)
	controllers.Company(api)
	controllers.AccountStatus(api)
	controllers.Role(api)
	controllers.Service(api)
	controllers.Location(api)
	controllers.Lead(api)
	controllers.SMS(api)
	controllers.Stripe(api)
}
