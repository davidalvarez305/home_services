package handlers

import (
	"errors"
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/gofiber/fiber/v2"
)

func CreateUser(c *fiber.Ctx) error {
	user := &actions.User{}
	err := c.BodyParser(&user)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	err = user.CreateUser()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": user,
	})
}

func GetUser(c *fiber.Ctx) error {
	user := &actions.User{}

	err := user.GetUserFromSession(c)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	if user.User == nil {
		return c.Status(404).JSON(fiber.Map{
			"data": errors.New("no user found"),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}

func Logout(c *fiber.Ctx) error {
	user := &actions.User{}

	err := user.Logout(c)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "Logged out!",
	})
}

func Login(c *fiber.Ctx) error {
	user := &actions.User{}
	err := c.BodyParser(&user)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	err = user.Login(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}

func UpdateUser(c *fiber.Ctx) error {
	var body actions.User
	user := &actions.User{}

	err := c.BodyParser(&body)

	if err != nil {
		return err
	}

	err = user.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	err = user.UpdateUser(body)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}

func DeleteUser(c *fiber.Ctx) error {
	user := &actions.User{}

	err := user.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	err = user.Delete()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	err = user.Logout(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "Deleted!",
	})
}

func ChangePassword(c *fiber.Ctx) error {

	// Handle Client Input
	type ChangePasswordInput struct {
		NewPassword string `json:"newPassword"`
	}
	code := c.Params("code")

	if code == "" {
		return c.Status(400).JSON(fiber.Map{
			"data": "No code sent in request.",
		})
	}

	// Initialize Structs
	var body ChangePasswordInput
	user := &actions.User{}
	token := &actions.Token{}

	err := c.BodyParser(&body)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Invalid input.",
		})
	}

	// Get User From Session
	err = user.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "User was not found.",
		})
	}

	// Retrieve Token from DB
	err = token.GetToken(code, user.ID)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Token was not found.",
		})
	}

	// Validate Token's Expiry Date
	difference := time.Now().Unix() - token.CreatedAt

	if difference > 300 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Token expired.",
		})
	}

	// Update User
	err = user.ChangePassword(body.NewPassword)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not change password.",
		})
	}

	// Delete Token
	err = token.DeleteToken()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not delete token.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}

func RequestChangePasswordCode(c *fiber.Ctx) error {
	user := &actions.User{}

	err := user.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	err = user.RequestChangePasswordCode()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}

func ForgotPassword(c *fiber.Ctx) error {

	// Get input from the client
	type ForgotPasswordInput struct {
		Email string `json:"email"`
	}
	var body ForgotPasswordInput

	err := c.BodyParser(&body)

	if err != nil {
		return err
	}

	// Initialize user & attempt to fetch from DB by using client input email.
	user := &actions.User{}

	err = user.GetUserByEmail(body.Email)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Couldn't find user using that e-mail.",
		})
	}

	err = user.RequestChangePasswordCode()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}

func ChangeProfilePicture(c *fiber.Ctx) error {
	user := &actions.User{}

	file, err := c.FormFile("image")

	if err != nil {
		return err
	}

	err = user.GetUserFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "User was not found.",
		})
	}

	err = user.ChangeProfilePicture(file)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not change profile picture.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}

func GetUsersByCompany(c *fiber.Ctx) error {
	users := &actions.Users{}
	var usersByCompany actions.UserCompanyRoles

	company := c.Query("company")

	if company == "" {
		return c.Status(400).JSON(fiber.Map{
			"data": "No company in query string.",
		})
	}

	err := usersByCompany.GetUsersByCompany(company)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not find users by that company.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": users,
	})
}

func AddUserToCompany(c *fiber.Ctx) error {

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

	userId, err := actions.GetUserIdFromSession(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not identify you.",
		})
	}

	originalUser := &actions.UserCompanyRole{}

	err = originalUser.GetUserCompanyRole(userId)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "Could not identify you.",
		})
	}

	user := &actions.User{}

	err = user.GetUserByEmail(input.Email)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "User not found.",
		})
	}

	userCompany := &actions.UserCompanyRole{}

	userCompany.CompanyID = originalUser.CompanyID
	userCompany.RoleID = 2 // Role 2 is "employee."
	userCompany.UserID = user.ID

	userCompany.SaveUserCompanyRole()

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}
