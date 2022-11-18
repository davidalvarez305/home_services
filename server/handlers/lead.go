package handlers

import (
	"github.com/davidalvarez305/home_services/server/actions"
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

	var clientImages []string

	for _, fileHeaders := range form.File {
		for _, image := range fileHeaders {
			uploadedImage, err := utils.UploadImageToS3(image)

			if err != nil {
				return c.Status(400).JSON(fiber.Map{
					"data": "Failed to process image.",
				})
			}

			clientImages = append(clientImages, uploadedImage)
		}
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
