package middleware

import (
	"os"
	"strings"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(c *fiber.Ctx) error {
	url := c.OriginalURL()
	headers := c.GetReqHeaders()

	if strings.Contains(url, "/login") || strings.Contains(url, "/register") || strings.Contains(url, "/forgot-password") || strings.Contains(headers["Origin"], os.Getenv("DJANGO_URL")) {
		return c.Next()
	}

	userId, err := actions.GetUserIdFromSession(c)

	if err != nil || userId == 0 {
		return c.Status(401).JSON(fiber.Map{
			"data": "Unauthorized.",
		})
	}

	return c.Next()
}
