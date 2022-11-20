package handlers

import (
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/gofiber/fiber/v2"
)

func CreateLead(c *fiber.Ctx) error {
	var input types.CreateLeadInput
	lead := &actions.Lead{}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	// Handle Client Photos
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to process images.",
		})
	}

	clientImages, err := utils.HandleMultipleImages(form)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to upload images.",
		})
	}

	// Append photos to input for later use
	input.Photos = clientImages

	err = lead.CreateLead(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to create a lead.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func GetLeadInfo(c *fiber.Ctx) error {
	leadId := c.Params("id")
	lead := &actions.Lead{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := lead.GetLead(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to query account details.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func UpdateLead(c *fiber.Ctx) error {
	leadId := c.Params("id")
	action := c.Query("action")
	lead := &actions.Lead{}
	input := &actions.Lead{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(action) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Action desired not included in query string.",
		})
	}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	err = lead.GetLead(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to query account details.",
		})
	}

	// Update fields which are allowed to be updated
	lead.FirstName = input.FirstName
	lead.LastName = input.LastName
	lead.Email = input.Email
	lead.PhoneNumber = input.PhoneNumber

	// Log user activity
	log := &models.LeadLog{
		Action:    action,
		CreatedAt: time.Now().Unix(),
	}

	lead.Log = append(lead.Log, log)

	err = lead.Save()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save updates.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func DeleteLead(c *fiber.Ctx) error {
	leadId := c.Params("id")
	lead := &actions.Lead{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := lead.Delete(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not delete lead.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "OK!",
	})
}

func LeadLogout(c *fiber.Ctx) error {
	lead := &actions.Lead{}

	err := lead.LeadLogout(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not logout.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "OK!",
	})
}

func GetQuotesByLead(c *fiber.Ctx) error {
	leadQuotes := &actions.LeadQuotes{}
	leadId := c.Params("id")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := leadQuotes.GetQuotesByLead(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to query quotes.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": leadQuotes,
	})
}

func CreateQuote(c *fiber.Ctx) error {
	var input types.CreateQuoteInput
	leadId := c.Params("id")
	lead := &actions.Lead{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := lead.GetLead(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to retrieve account information.",
		})
	}

	err = c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to parse request body.",
		})
	}

	// Handle Client Photos
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to process images.",
		})
	}

	clientImages, err := utils.HandleMultipleImages(form)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to upload images.",
		})
	}

	input.Photos = clientImages
	q := &actions.Quote{}

	err = q.CreateQuote(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to create quote.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": q,
	})
}
