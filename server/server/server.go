package server

import (
	"os"

	"github.com/davidalvarez305/home_services/server/controllers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
	"gorm.io/gorm"
)

type Server struct {
	App     *fiber.App
	DB      *gorm.DB
	Session *session.Store
	Port    string
}

func NewServer(opts *Server) *Server {
	return &Server{
		App:     opts.App,
		DB:      opts.DB,
		Session: opts.Session,
		Port:    opts.Port,
	}
}

func (server *Server) Start() {

	CLIENT_URL := os.Getenv("CLIENT_URL")
	DJANGO_URL := os.Getenv("DJANGO_URL")
	origins := CLIENT_URL + ", " + DJANGO_URL

	server.App.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowCredentials: true,
	}))

	// , middleware.AuthMiddleware
	api := server.App.Group("api")
	controllers.User(api)
	controllers.Company(api)
	controllers.AccountStatus(api)
	controllers.Role(api)
	controllers.Service(api)
	controllers.Location(api)
	controllers.Lead(api)
	controllers.SMS(api)
	controllers.Stripe(api)
	controllers.Contact(api)

	server.App.Listen(":" + server.Port)
}
