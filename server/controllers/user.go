package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
	"github.com/davidalvarez305/home_services/server/middleware"
	"github.com/gofiber/fiber/v2"
)

func User(router fiber.Router) {

	user := router.Group("user")

	// No login required
	user.Post("/register", handlers.CreateUser)
	user.Post("/forgot-password", handlers.ForgotPassword)
	user.Post("/login", handlers.Login)
	user.Get("/", handlers.GetUser)

	// Login required
	user.Put("/:id", middleware.AccessUserResources(handlers.UpdateUser))
	user.Delete("/:id", middleware.AccessUserResources(handlers.DeleteUser))
	user.Post("/:id/logout", middleware.AccessUserResources(handlers.Logout))
	user.Put("/:id/change-picture", middleware.AccessUserResources(handlers.ChangeProfilePicture))
	user.Get("/:id/change-password", middleware.AccessUserResources(handlers.RequestChangePasswordCode))
	user.Put("/:id/change-password/:code", middleware.AccessUserResources(handlers.ChangePassword))
}
