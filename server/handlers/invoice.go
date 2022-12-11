package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func CreateInvoice(c *fiber.Ctx) error {
	companyId := c.Params("companyId")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Include company ID in path.",
		})
	}

	company := &actions.Company{}

	err := company.GetCompanyByID(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find company in request params.",
		})
	}

	invoice, err := actions.CreateInvoice(company)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to create invoice.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": invoice,
	})
}

func GetInvoices(c *fiber.Ctx) error {
	companyId := c.Params("companyId")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Include company ID in path.",
		})
	}

	invoices := &actions.Invoices{}

	err := invoices.GetInvoiceDetails(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to fetch invoices.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": invoices,
	})
}
