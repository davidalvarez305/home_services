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

// Verify that user can mutate a company's resources
// Step 1: can access company resources
// Step 2: has correct permissions to mutate company resources
func canMutateCompanyResources(c *fiber.Ctx) error {
	user, err := actions.GetUserFromSession(c)

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not authenticated.",
		})
	}

	if user.AccountStatusID != 1 {
		return c.Status(403).JSON(fiber.Map{
			"data": "Account status ID not active.",
		})
	}

	if user.RoleID != 1 {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not enough permissions to mutate company resources",
		})
	}

	return c.Next()
}

// Verify that user can access a company's resources
// Step 1: user is logged in
// Step 2: user id can be verified as existing within company's users
func CompanyResourceAccessRestriction(fn fiber.Handler) fiber.Handler {
	return func(c *fiber.Ctx) error {
		path := c.OriginalURL()

		method := c.Method()

		if !strings.Contains(path, "company") {
			return fn(c)
		}

		if len(os.Getenv("PRODUCTION")) == 0 {
			if method == "GET" {
				return fn(c)
			}

			return canMutateCompanyResources(c)
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
		found := false
		for _, user := range companyUsers {
			if user.ID == sessionUser.ID {
				found = true
			}
		}

		if !found {
			return c.Status(403).JSON(fiber.Map{
				"data": "Not allowed to access these resources.",
			})
		}

		if method == "GET" {
			return fn(c)
		}

		return canMutateCompanyResources(c)
	}
}

func AccessUserResources(fn fiber.Handler) fiber.Handler {
	return func(c *fiber.Ctx) error {
		paramsId, err := c.ParamsInt("id")
		userId, err := actions.GetUserIdFromSession(c)

		if err != nil || userId == 0 {
			return c.Status(401).JSON(fiber.Map{
				"data": "Unauthorized.",
			})
		}

		if paramsId != userId {
			return c.Status(403).JSON(fiber.Map{
				"data": "Not allowed to access another user's resources.",
			})
		}

		return fn(c)
	}
}
