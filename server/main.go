package main

import (
	"encoding/gob"
	"log"
	"os"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/routes"
	"github.com/davidalvarez305/home_services/server/sessions"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	gob.Register(models.Users{})

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading env file.")
	}

	CLIENT_URL := os.Getenv("CLIENT_URL")
	PORT := os.Getenv("PORT")

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     CLIENT_URL,
		AllowCredentials: true,
	}))

	database.Connect()
	sessions.Init()

	routes.Router(app)
	app.Listen(":" + PORT)
}
