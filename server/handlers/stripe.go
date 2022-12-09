package handlers

import (
	"encoding/json"
	"fmt"

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
	case "payment_intent.succeeded":
		var paymentIntent stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &paymentIntent)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not parse payment intent.",
			})
		}
		fmt.Printf("%+v\n", paymentIntent)
	case "payment_method.attached":
		var paymentMethod stripe.PaymentMethod
		err := json.Unmarshal(event.Data.Raw, &paymentMethod)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not parse payment method.",
			})
		}
		fmt.Printf("paymentMethod: %+v\n", paymentMethod)
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "OK!",
	})
}
