package handlers

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/gofiber/fiber/v2"
)

func CreateCompany(c *fiber.Ctx) error {
	var input types.CreateCompanyInput
	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	user, err := actions.GetUserFromSession(c)

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not authenticated.",
		})
	}

	if user.RoleID != 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Cannot be assigned to more than one company.",
		})
	}

	if user.AccountStatusID != 1 {
		return c.Status(403).JSON(fiber.Map{
			"data": "Account status ID not active.",
		})
	}

	var company models.Company

	company.Name = input.Name

	err = actions.CreateStripeCustomer(user, company)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not create Stripe Customer.",
		})
	}

	createdCompany, err := actions.CreateCompany(input, user)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not create company.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": createdCompany,
	})
}

func GetUsersByCompany(c *fiber.Ctx) error {
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

	usersByCompany, err := actions.GetUsersByCompany(companyId)

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
	type InviteUserInput struct {
		Email string `json:"email"`
	}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}

	var input InviteUserInput

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Bad input.",
		})
	}

	user, err := actions.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not identify you.",
		})
	}

	// Check user permissions
	canInvite := actions.CheckInvitePermissions(user, companyId, input.Email)

	if !canInvite {
		return c.Status(400).JSON(fiber.Map{
			"data": "Cannot invite that user.",
		})
	}

	err = actions.InviteUserToCompany(user.CompanyID, input.Email)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not invite user to the company.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "OK",
	})
}

func AddNewUserToCompany(c *fiber.Ctx) error {
	var addUserInput models.User

	// Check if user has code coming from /invite/:code
	code := c.Params("code")

	if len(code) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "No code found in request params.",
		})
	}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(403).JSON(fiber.Map{
			"data": "No company id found in URL params.",
		})
	}

	err := c.BodyParser(&addUserInput)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	companyToken, err := actions.GetCompanyToken(code)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find company using that token.",
		})
	}

	// Check that user from session's e-mail and user from token's e-mail are the same
	canAccept := actions.CheckCanAcceptInvitation(addUserInput, companyId, companyToken)

	if !canAccept {
		return c.Status(400).JSON(fiber.Map{
			"data": "Cannot accept invitation using that token.",
		})
	}

	addUserInput.RoleID = 2 // Role 2 is "employee".
	addUserInput.CompanyID = companyToken.CompanyID

	// Create with client input
	createdUser, err := actions.CreateUser(addUserInput)

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

	err = actions.DeleteCompanyToken(companyToken)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error while creating user.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": createdUser,
	})
}

func UpdateCompany(c *fiber.Ctx) error {
	input := &types.CreateCompanyInput{}

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

	hasPermission, err := actions.CheckUserPermission(c, companyId)

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

	updatedCompany, err := actions.UpdateCompany(companyId, input)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "Company could not be updated.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": updatedCompany,
	})
}

func DeleteCompany(c *fiber.Ctx) error {
	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(404).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	hasPermission, err := actions.CheckUserPermission(c, companyId)

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

	err = actions.DeleteCompany(companyId)

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

	hasPermission, err := actions.CheckUserPermission(c, companyId)

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

	// Ensure that there must always be one owner
	companyOwners, err := actions.GetCompanyOwners(companyId)

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Cannot delete because there must always be at least one owner.",
		})
	}

	var count = 0
	for _, user := range companyOwners {
		if user.RoleID == 1 {
			count += 1
		}
	}

	// If this logic is correct, the count will never be zero, so it's safe to index the ID below.
	if count <= 1 && userId == fmt.Sprintf("%+v", (companyOwners)[0].ID) {
		return c.Status(403).JSON(fiber.Map{
			"data": "Invalid action. This would remove all owners from the company.",
		})
	}

	err = actions.RemoveUserFromCompany(companyId, userId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not remove user from company.",
		})
	}

	id, err := strconv.Atoi(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse company id.",
		})
	}

	companyUsers, err := actions.GetUsersByCompany(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find any users for that company.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": companyUsers,
	})
}

func UpdateCompanyUsers(c *fiber.Ctx) error {
	var input []models.User
	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(404).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse client input.",
		})
	}

	hasPermission, err := actions.CheckUserPermission(c, companyId)

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

	// Ensure that there must always be one owner
	// This action presumes that all the company's users will be coming from the client on every request.
	var count = 0
	for _, user := range input {

		if user.RoleID == 1 {
			count += 1
		}
	}

	if count == 0 {
		return c.Status(403).JSON(fiber.Map{
			"data": "Invalid action. There must always be one owner.",
		})
	}

	updatedUsers, err := actions.UpdateCompanyUsers(companyId, input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not update user fields.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": updatedUsers,
	})
}

func AddExistingUserToCompany(c *fiber.Ctx) error {
	code := c.Params("code")

	if len(code) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "No code found in params.",
		})
	}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in params.",
		})
	}

	user, err := actions.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "User is not logged in.",
		})
	}

	companyToken, err := actions.GetCompanyToken(code)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find company using that token.",
		})
	}

	canAccept := actions.CheckCanAcceptInvitation(user, companyId, companyToken)

	if !canAccept {
		return c.Status(400).JSON(fiber.Map{
			"data": "Cannot accept invitation using that token.",
		})
	}

	user.RoleID = 2          // Role 2 is "employee".
	user.AccountStatusID = 2 // Account is inactive after first added to a company.
	user.CompanyID = companyToken.CompanyID
	user.UpdatedAt = time.Now().Unix()

	// Create with client input
	updatedUser, err := actions.SaveUser(user)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Create User.",
		})
	}

	err = actions.DeleteCompanyToken(companyToken)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error while creating user.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": updatedUser,
	})
}

func GetCompanyServices(c *fiber.Ctx) error {
	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}

	services, err := actions.GetCompanyServiceAreas(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error querying services areas.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": services,
	})
}

func CreateCompanyServices(c *fiber.Ctx) error {
	var services []models.CompanyServicesLocations

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}

	user, err := actions.GetUserFromSession(c)

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not logged in.",
		})
	}

	err = c.BodyParser(&services)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse client input.",
		})
	}

	// Check Permissions
	canCreate := actions.CheckPermissions(services, companyId, user)

	if !canCreate {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not allowed to add services.",
		})
	}

	err = actions.CreateCompanyServiceAreas(services)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error deleting service areas.",
		})
	}

	updatedServices, err := actions.GetCompanyServiceAreas(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error querying services areas.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": updatedServices,
	})
}

func DeleteCompanyLocation(c *fiber.Ctx) error {
	var locations models.CompanyServicesLocations

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}

	user, err := actions.GetUserFromSession(c)

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not logged in.",
		})
	}

	err = c.BodyParser(&locations)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse client input.",
		})
	}

	// Check that user's company is the same as the company in the URL params
	if fmt.Sprintf("%+v", user.CompanyID) != companyId {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not allowed to make changes to that company's services.",
		})
	}

	if user.RoleID != 1 || user.AccountStatusID != 1 {
		return c.Status(403).JSON(fiber.Map{
			"data": "User doesn't have permissions for that action.",
		})
	}

	err = actions.DeleteCompanyServiceAreas(locations)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error deleting service area.",
		})
	}

	updatedCompanyServiceAreas, err := actions.GetCompanyServiceAreas(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error querying services areas.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": updatedCompanyServiceAreas,
	})
}

func GetCompanyLeads(c *fiber.Ctx) error {
	var qs types.CompanyLeadsQS

	err := c.QueryParser(&qs)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to parse querystring from request.",
		})
	}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}

	service_id := c.Query("service_id")
	zip_code := c.Query("zip_code")

	if service_id != "null" {
		qs.Service = service_id
	}

	if zip_code != "null" {
		qs.ZipCode = zip_code
	}

	leads, err := actions.GetCompanyLeads(companyId, qs)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to fetch company leads.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": leads,
	})
}

func GetCompany(c *fiber.Ctx) error {
	companyId := c.Params("id")

	if companyId == "" {
		return c.Status(400).JSON(fiber.Map{
			"data": "No company found in params.",
		})
	}

	var company models.Company

	err := database.DB.Where("id = ?", companyId).First(&company).Error

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to fetch company details.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": company,
	})
}

func GetCompanyInvoices(c *fiber.Ctx) error {
	companyId := c.Params("id")

	if companyId == "" {
		return c.Status(400).JSON(fiber.Map{
			"data": "No company found in params.",
		})
	}

	invoices, err := actions.GetCompanyInvoices(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to fetch company invoices.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": invoices,
	})
}

func GetCompanyLeadsByDate(c *fiber.Ctx) error {
	date := c.Params("date")

	if len(date) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Date not found in QS.",
		})
	}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}

	leads, err := actions.GetCompanyLeadsByDate(date, companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to fetch company leads.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": leads,
	})
}
