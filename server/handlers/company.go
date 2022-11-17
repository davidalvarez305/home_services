package handlers

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
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

	company := &actions.Company{}

	err = company.CreateCompany(input)

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Could not create company.",
		})
	}

	// Create company with authenticated user set as 'Owner' as default
	user.CompanyID = company.ID
	user.RoleID = 1 // Role 2 is "owner".
	user.UpdatedAt = time.Now().Unix()

	// Persist to DB
	err = user.Save()

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Could not attach company to user.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": company,
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

	err = user.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not identify you.",
		})
	}

	// Check user permissions
	canInvite := user.CheckInvitePermissions(companyId, input.Email)

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
	user := &actions.User{}

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

	// Check that user from session's e-mail and user from token's e-mail are the same
	canAccept := user.CheckCanAcceptInvitation(companyId, companyToken)

	if !canAccept {
		return c.Status(400).JSON(fiber.Map{
			"data": "Cannot accept invitation using that token.",
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

	// Ensure that there must always be one owner
	companyOwners := &actions.Users{}
	err = companyOwners.GetCompanyOwners(companyId)

	if err != nil {
		return c.Status(403).JSON(fiber.Map{
			"data": "Cannot delete because there must always be at least one owner.",
		})
	}

	var count = 0
	for _, user := range *companyOwners {
		if user.RoleID == 1 {
			count += 1
		}
	}

	// If this logic is correct, the count will never be zero, so it's safe to index the ID below.
	if count <= 1 && userId == fmt.Sprintf("%+v", (*companyOwners)[0].ID) {
		return c.Status(403).JSON(fiber.Map{
			"data": "Invalid action. This would remove all owners from the company.",
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

	// Ensure that there must always be one owner
	// This action presumes that all the company's users will be coming from the client on every request.
	var count = 0
	for _, user := range *input {

		if user.RoleID == 1 {
			count += 1
		}
	}

	if count == 0 {
		return c.Status(403).JSON(fiber.Map{
			"data": "Invalid action. There must always be one owner.",
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

	canAccept := user.CheckCanAcceptInvitation(companyId, companyToken)

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

func GetCompanyServices(c *fiber.Ctx) error {
	services := &actions.CompanyServicesByArea{}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}

	err := services.GetCompanyServiceAreas(companyId)

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
	services := &actions.CompanyServicesLocations{}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}
	user := &actions.User{}

	err := user.GetUserFromSession(c)

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
	canCreate := services.CheckPermissions(companyId, user)

	if !canCreate {
		return c.Status(403).JSON(fiber.Map{
			"data": "Not allowed to add services.",
		})
	}

	err = services.CreateCompanyServiceAreas()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error querying services areas.",
		})
	}

	updatedServices := &actions.CompanyServicesByArea{}

	err = updatedServices.GetCompanyServiceAreas(companyId)

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
	locations := &actions.CompanyServicesLocations{}

	companyId := c.Params("id")

	if len(companyId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Company ID not found in URL params.",
		})
	}
	user := &actions.User{}

	err := user.GetUserFromSession(c)

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

	err = locations.DeleteCompanyServiceAreas()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error querying services areas.",
		})
	}

	updatedServices := &actions.CompanyServicesByArea{}

	err = updatedServices.GetCompanyServiceAreas(companyId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error querying services areas.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": updatedServices,
	})
}
