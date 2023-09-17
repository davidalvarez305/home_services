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

	var invoice stripe.Invoice
	var paymentStatusID int
	var logMessage string
	var emailMsg string
	var emailSubject string

	switch event.Type {
	case "invoice.payment_succeeded":
	case "invoice.paid":
		{
			err := json.Unmarshal(event.Data.Raw, &invoice)

			if err != nil {
				return c.Status(400).JSON(fiber.Map{
					"data": "Could not parse payment intent.",
				})
			}

			paymentStatusID = 2 // Payment completed
			logMessage = "Invoice payment completed."
			emailSubject = logMessage
			emailMsg = fmt.Sprintf("Succesful payment for Invoice ID: %+v", invoice.ID)
		}

	case "invoice.payment_failed":
		var invoice stripe.Invoice
		err := json.Unmarshal(event.Data.Raw, &invoice)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not parse payment method.",
			})
		}

		paymentStatusID = 3 // Payment failed
		logMessage = "Invoice payment failed."
		emailSubject = logMessage
		emailMsg = fmt.Sprintf("Payment failed for Invoice ID: %+v", invoice.ID)

	case "invoice.marked_uncollectible":
		var invoice stripe.Invoice
		err := json.Unmarshal(event.Data.Raw, &invoice)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not parse payment method.",
			})
		}

		paymentStatusID = 4 // Payment uncollectible
		logMessage = "Invoice payment marked uncollectible."
		emailSubject = logMessage
		emailMsg = fmt.Sprintf("Payment marked uncollectible for Invoice ID: %+v", invoice.ID)

	case "invoice.payment_action_required":
		var invoice stripe.Invoice
		err := json.Unmarshal(event.Data.Raw, &invoice)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not parse payment method.",
			})
		}

		paymentStatusID = 5 // Payment action required
		logMessage = "Invoice payment action required."
		emailSubject = logMessage
		emailMsg = fmt.Sprintf("Payment action required for Invoice ID: %+v", invoice.ID)
	}

	inv, err := actions.GetInvoiceByInvoiceID(invoice.ID)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not fetch invoice by invoice ID.",
		})
	}

	// Save invoice status
	inv.InvoicePaymentStatusID = paymentStatusID
	err = actions.SaveInvoice(inv)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save invoice status.",
		})
	}

	err = actions.SaveCompanyLog(logMessage, fmt.Sprintf("%+v", inv.CompanyID))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save log.",
		})
	}

	// E-mail to myself with details
	err = utils.SendGmail(emailMsg, os.Getenv("GMAIL_EMAIL"), emailSubject)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to send e-mail.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "OK!",
	})
}
