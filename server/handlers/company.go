package handlers

import (
	"fmt"
	"strings"
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/gofiber/fiber/v2"
)

func CreateCompany(c *fiber.Ctx) error {
	input := &types.CreateCompanyInput{}
	user := &actions.User{}
	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	err = user.GetUserFromSession(c)

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not authenticated.",
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

		if strings.Contains(err.Error(), "23505") {
			return c.Status(400).JSON(fiber.Map{
				"data": "Cannot have more than one company.",
			})
		}

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

	// Create company with authenticated user set as 'Owner' as default
	user.CompanyID = co.ID
	user.RoleID = 1 // Role 2 is "owner".
	user.UpdatedAt = time.Now().Unix()

	// Persist to DB
	err = user.Save()

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "Could not add user to company.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": company,
	})
}

func DeleteLocation(c *fiber.Ctx) error {
	location := &actions.CompanyServicesLocations{}
	updatedLocations := &actions.CompanyServicesByArea{}

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

// This endpoint expects a slice of company_services_locations. Single structs will not work.
func CreateServicesByZipCode(c *fiber.Ctx) error {
	services := &actions.CompanyServicesLocationsSlice{}

	err := c.BodyParser(&services)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	companyId, err := actions.GetCompanyIdFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Find Company By User Session.",
		})
	}

	err = services.CreateCompanyServiceLocations(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Create Services.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": services,
	})
}

func CreateServicesByCity(c *fiber.Ctx) error {
	var input []types.CreateServicesInput
	var services actions.CompanyServicesLocationsSlice

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	for _, service := range input {
		var zipCodes actions.ZipCodes

		err = zipCodes.GetZipCodesByCity(service.CityID)

		if err != nil {
			fmt.Printf("Could not get zip codes for city: %v", service.CityID)
			continue
		}

		for _, zipCode := range zipCodes {
			service := models.CompanyServicesLocations{
				ZipCodeID: zipCode.ID,
				ServiceID: service.ServiceID,
				CompanyID: service.CompanyID,
			}

			services = append(services, &service)
		}
	}

	if len(services) == 0 {
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Unable to Create Services.",
			})
		}
	}

	err = services.CreateCompanyServiceLocations(services[0].CompanyID)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Create Services.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": services,
	})
}
