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

func DeleteLocation(c *fiber.Ctx) error {
	location := &actions.CompanyServicesLocations{}
	updatedLocations := &actions.CompanyServicesLocationsSlice{}

	companyId, err := actions.GetCompanyIdFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not identify user.",
		})
	}

	zipCode := c.Query("zip_code")

	// Delete Location by Using Zip Code
	if len(zipCode) > 0 {
		err := location.DeleteServiceByZipCode(zipCode, companyId)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not delete the location associated with that service.",
			})
		}

		err = updatedLocations.GetCompanyServiceAreas(companyId)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not retrieve updated locations.",
			})
		}

		return c.Status(200).JSON(fiber.Map{
			"data": updatedLocations,
		})
	}

	city := c.Query("city")

	// Delete Location by Using City
	if len(zipCode) > 0 {
		err := location.DeleteServiceByCity(city, companyId)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not delete the location associated with that service.",
			})
		}

		err = updatedLocations.GetCompanyServiceAreas(companyId)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Could not retrieve updated locations.",
			})
		}

		return c.Status(200).JSON(fiber.Map{
			"data": updatedLocations,
		})
	}

	return c.Status(400).JSON(fiber.Map{
		"data": "Bad Input.",
	})
}
