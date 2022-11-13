package handlers

import (
	"fmt"
	"strconv"
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

func GetUsersByCompany(c *fiber.Ctx) error {
	usersByCompany := &actions.Users{}

	id := c.Params("id")

	if len(id) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	companyId, err := strconv.Atoi(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Invalid company id.",
		})
	}

	err = usersByCompany.GetUsersByCompany(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find users by that company.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": usersByCompany,
	})
}

func InviteUserToCompany(c *fiber.Ctx) error {
	user := &actions.User{}

	type InviteUserInput struct {
		Email string `json:"email"`
	}

	var input InviteUserInput

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Bad input.",
		})
	}

	err = user.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not identify you.",
		})
	}

	err = actions.InviteUserToCompany(user.CompanyID, input.Email)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "Could not invite user to the company.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "OK",
	})
}

func AddNewUserToCompany(c *fiber.Ctx) error {
	user := &actions.User{}

	// Check if user has code coming from /invite/:code
	code := c.Params("code")

	if len(code) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "No code found in request params.",
		})
	}

	err := c.BodyParser(&user)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	// Fetch company token
	companyToken := &actions.CompanyToken{}

	err = companyToken.GetCompanyToken(code)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find company using that token.",
		})
	}

	// Token expires after 5 minutes.
	if time.Now().Unix()-companyToken.CreatedAt > 300 {
		err = companyToken.DeleteCompanyToken()

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Error validating token.",
			})
		}

		return c.Status(400).JSON(fiber.Map{
			"data": "Token expired.",
		})
	}

	// Check that user from session's e-mail and user from token's e-mail are the same
	if companyToken.Email != user.Email {
		return c.Status(403).JSON(fiber.Map{
			"data": "Token was generated for a different e-mail address.",
		})
	}

	user.RoleID = 2 // Role 2 is "employee".
	user.CompanyID = companyToken.CompanyID

	// Create with client input
	err = user.CreateUser()

	if err != nil {

		if strings.Contains(err.Error(), "23505") {
			return c.Status(400).JSON(fiber.Map{
				"data": "Somebody with that username or e-mail already exists.",
			})
		}

		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Create User.",
		})
	}

	err = companyToken.DeleteCompanyToken()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error while creating user.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": user,
	})
}

func UpdateCompany(c *fiber.Ctx) error {
	input := &actions.Company{}
	company := &actions.Company{}
	user := &actions.User{}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(404).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not correctly parse company fields.",
		})
	}

	hasPermission, err := user.CheckUserPermission(c, companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not check user permissions.",
		})
	}

	// Only company owners can mutate company fields
	if !hasPermission {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not allowed.",
		})
	}

	err = company.UpdateCompany(companyId, *input.Company)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "Company could not be updated.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": company,
	})
}

func DeleteCompany(c *fiber.Ctx) error {
	company := &actions.Company{}
	user := &actions.User{}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(404).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	hasPermission, err := user.CheckUserPermission(c, companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not check user permissions.",
		})
	}

	// Only company owners can mutate company fields
	if !hasPermission {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not allowed.",
		})
	}

	err = company.DeleteCompany(companyId)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "Company could not be deleted.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "OK",
	})
}

// Update a user's CompanyID & RoleID, then return all users that belong to a company.
func RemoveUserFromCompany(c *fiber.Ctx) error {
	companyOwner := &actions.User{}
	userToUpdate := &actions.User{}
	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	userId := c.Params("userId")

	if len(userId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "No User ID found in query string.",
		})
	}

	hasPermission, err := companyOwner.CheckUserPermission(c, companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not check user permissions.",
		})
	}

	// Only company owners can mutate company fields
	if !hasPermission {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not allowed.",
		})
	}

	err = userToUpdate.RemoveUserFromCompany(companyId, userId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not remove user from company.",
		})
	}

	users := &actions.Users{}

	id, err := strconv.Atoi(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse company id.",
		})
	}

	err = users.GetUsersByCompany(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find any users for that company.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": users,
	})
}

func UpdateCompanyUsers(c *fiber.Ctx) error {
	input := &actions.Users{}
	companyOwner := &actions.User{}
	usersToUpdate := &actions.Users{}
	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(404).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	userId := c.Query("userId")

	if len(userId) == 0 {
		return c.Status(404).JSON(fiber.Map{
			"data": "No User ID found in query string.",
		})
	}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse client input.",
		})
	}

	hasPermission, err := companyOwner.CheckUserPermission(c, companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not check user permissions.",
		})
	}

	// Only company owners can mutate user permission fields
	if !hasPermission {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not allowed.",
		})
	}

	err = usersToUpdate.UpdateCompanyUsers(companyId, input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not update user fields.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": usersToUpdate,
	})
}

func AddExistingUserToCompany(c *fiber.Ctx) error {
	user := &actions.User{}
	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	code := c.Params("code")

	if len(code) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "No code found in params.",
		})
	}

	err := user.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "User is not logged in.",
		})
	}

	// Fetch company token
	companyToken := &actions.CompanyToken{}

	err = companyToken.GetCompanyToken(code)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find company using that token.",
		})
	}

	// Token expires after 5 minutes.
	if time.Now().Unix()-companyToken.CreatedAt > 300 {
		err = companyToken.DeleteCompanyToken()

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"data": "Error validating token.",
			})
		}

		return c.Status(400).JSON(fiber.Map{
			"data": "Token expired.",
		})
	}

	// Check that user from session's e-mail and user from token's e-mail are the same
	if companyToken.Email != user.Email {
		return c.Status(403).JSON(fiber.Map{
			"data": "Token was generated for a different e-mail address.",
		})
	}

	user.RoleID = 2 // Role 2 is "employee".
	user.CompanyID = companyToken.CompanyID
	user.UpdatedAt = time.Now().Unix()

	// Create with client input
	err = user.Save()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Create User.",
		})
	}

	err = companyToken.DeleteCompanyToken()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error while creating user.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}
