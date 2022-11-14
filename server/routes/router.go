package routes

import (
	"github.com/davidalvarez305/home_services/server/controllers"
	"github.com/davidalvarez305/home_services/server/middleware"
	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App) {
	api := app.Group("api", middleware.AuthMiddleware)
	controllers.User(api)
	controllers.Company(api)
	controllers.AccountStatus(api)
	controllers.Role(api)
	controllers.Service(api)
}
