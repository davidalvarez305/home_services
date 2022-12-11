package handlers

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v74"
)

func HandleStripeWebhooks(c *fiber.Ctx) error {
	event := stripe.Event{}

	err := c.BodyParser(&event)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Event body could not be parsed.",
		})
	}

	switch event.Type {
	case "invoice.paid":
		var invoice stripe.Invoice
		err := json.Unmarshal(event.Data.Raw, &invoice)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not parse payment intent.",
			})
		}

		inv := &actions.Invoice{}

		err = inv.GetInvoiceByInvoiceID(invoice.ID)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not fetch invoice by invoice ID.",
			})
		}

		// Update invoice payment status
		inv.InvoicePaymentStatusID = 2
		err = inv.Save()

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Failed to update invoice payment status.",
			})
		}
		// Create log
		log := &actions.CompanyLog{}

		err = log.Save("Invoice payment completed.", fmt.Sprintf("%+v", inv.CompanyID))

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Failed to save log.",
			})
		}

	case "invoice.payment_failed":
		var invoice stripe.Invoice
		err := json.Unmarshal(event.Data.Raw, &invoice)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not parse payment method.",
			})
		}

		// Fetch invoice
		inv := &actions.Invoice{}

		err = inv.GetInvoiceByInvoiceID(invoice.ID)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not fetch invoice by invoice ID.",
			})
		}

		// Create log
		log := &actions.CompanyLog{}

		err = log.Save("Invoice payment failed.", fmt.Sprintf("%+v", inv.CompanyID))

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Failed to save log.",
			})
		}

		// E-mail to myself with details
		msg := fmt.Sprintf("Invoice payment failed for %v", inv.CompanyID)
		err = utils.SendGmail(msg, os.Getenv("GMAIL_EMAIL"), "Invoice payment failed.")

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Failed to send e-mail.",
			})
		}
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "OK!",
	})
}
