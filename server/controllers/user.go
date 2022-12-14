package controllers

import (
	"github.com/davidalvarez305/home_services/server/handlers"
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
	user.Put("/", handlers.UpdateUser)
	user.Delete("/", handlers.DeleteUser)
	user.Post("/logout", handlers.Logout)
	user.Put("/change-picture", handlers.ChangeProfilePicture)
	user.Get("/change-password", handlers.RequestChangePasswordCode)
	user.Put("/change-password/:code", handlers.ChangePassword)
}
