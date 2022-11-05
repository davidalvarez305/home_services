package handlers

import (
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
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

	// Create New Company
	company := &actions.Company{}
	company.Name = input.Name
	company.Logo = input.Logo
	company.CreatedAt = time.Now().Unix()
	company.UpdatedAt = time.Now().Unix()

	err = company.CreateCompany()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not create that company.",
		})
	}

	// Insert Company Address
	address := &actions.Address{}
	address.CityID = input.City
	address.StateID = input.State
	address.CountryID = 1
	address.StreetAddressLine1 = input.StreetAddressLine1
	address.StreetAddressLine2 = input.StreetAddressLine2
	address.StreetAddressLine3 = input.StreetAddressLine3
	address.ZipCodeID = input.ZipCode
	address.CompanyID = company.ID

	err = address.CreateAddress()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not save address.",
		})
	}

	// Set Company Status to Pending Approval
	companyStatus := &actions.CompanyAccountStatus{}
	companyStatus.AccountStatusID = 2
	companyStatus.CompanyID = company.ID
	companyStatus.CreatedAt = time.Now().Unix()
	companyStatus.UpdatedAt = time.Now().Unix()

	err = companyStatus.CreateCompanyAccountStatus()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not create company account status.",
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
