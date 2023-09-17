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

func CanEditCompanyResources(fn fiber.Handler) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, err := actions.GetUserFromSession(c)

		if err != nil {
			return c.Status(403).JSON(fiber.Map{
				"data": "Not authenticated.",
			})
		}

		if user.RoleID != 0 {
			return c.Status(400).JSON(fiber.Map{
				"data": "Cannot be assigned to more than one company.",
			})
		}

		if user.AccountStatusID != 1 {
			return c.Status(403).JSON(fiber.Map{
				"data": "Account status ID not active.",
			})
		}

		return fn(c)
	}
}

// Verify that user can access a company's resources
// Step 1: user is logged in
// Step 2: user id can be verified as existing within company's users
func CompanyResourceAccessRestriction(fn fiber.Handler) fiber.Handler {
	return func(c *fiber.Ctx) error {
		path := c.OriginalURL()

		if !strings.Contains(path, "company") {
			return fn(c)
		}

		if os.Getenv("PRODUCTION") == "0" {
			return fn(c)
		}

		sessionUser, err := actions.GetUserFromSession(c)

		if err != nil {
			return c.Status(403).JSON(fiber.Map{
				"data": "User is not logged in.",
			})
		}

		companyId, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(403).JSON(fiber.Map{
				"data": "Could not convert ID from params to int.",
			})
		}

		companyUsers, err := actions.GetUsersByCompany(companyId)

		// If the user is found here, everything should work as normal.
		for _, user := range companyUsers {
			if user.ID == sessionUser.ID {
				return fn(c)
			}
		}

		return c.Status(403).JSON(fiber.Map{
			"data": "Not allowed to access these resources.",
		})
	}
}
