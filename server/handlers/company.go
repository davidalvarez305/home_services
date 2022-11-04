package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func CreateCompany(c *fiber.Ctx) error {
	company := &actions.Company{}
	err := c.BodyParser(&company)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	err = company.CreateCompany()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Could not create that company.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": company,
	})
}

func UpdateCompany(c *fiber.Ctx) error {
	company := &actions.Company{}
	err := c.BodyParser(&company)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	err = company.UpdateCompany()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Could not update that company.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": company,
	})
}

func GetCompanyDetails(c *fiber.Ctx) error {
	company := &actions.Company{}

	err := company.UpdateCompany()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Could not find that company.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": company,
	})
}
