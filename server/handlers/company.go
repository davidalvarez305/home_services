package handlers

import (
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/gofiber/fiber/v2"
)

func CreateCompany(c *fiber.Ctx) error {
	input := &types.CreateCompanyInput{}
	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	// Create New Company With Default Status as 'Pending Approval'
	co := &actions.Company{}
	company := models.Company{
		Name:            input.Name,
		Logo:            input.Logo,
		AccountStatusID: 2,
		CreatedAt:       time.Now().Unix(),
		UpdatedAt:       time.Now().Unix(),
	}
	co.Company = &company

	err = co.CreateCompany()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not create that company.",
		})
	}

	// Insert Company Address
	address := &actions.Address{}
	addr := models.Address{
		CityID:             input.City,
		StateID:            input.State,
		ZipCodeID:          input.ZipCode,
		CountryID:          1,
		StreetAddressLine1: input.StreetAddressLine1,
		StreetAddressLine2: input.StreetAddressLine2,
		StreetAddressLine3: input.StreetAddressLine3,
		CompanyID:          co.ID,
	}
	address.Address = &addr

	err = address.CreateAddress()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not save address.",
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

	err := company.GetCompany()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Could not find that company.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": company,
	})
}
