package handlers

import (
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/gofiber/fiber/v2"
)

func CreateUser(c *fiber.Ctx) error {
	var user models.User
	err := c.BodyParser(&user)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Unable to Parse Request Body.",
		})
	}

	createdUser, err := actions.CreateUser(user)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Failed to create user.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": createdUser,
	})
}

func GetUser(c *fiber.Ctx) error {
	user, err := actions.GetUserFromSession(c)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}

func Logout(c *fiber.Ctx) error {
	err := actions.UserLogout(c)

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
	var loginInput models.User
	err := c.BodyParser(&loginInput)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	user, err := actions.Login(loginInput, c)

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
	var body models.User
	userId := c.Params("id")

	err := c.BodyParser(&body)

	if err != nil {
		return err
	}

	updatedUser, err := actions.UpdateUser(userId, body)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": updatedUser,
	})
}

func DeleteUser(c *fiber.Ctx) error {
	userId := c.Params("id")

	user, err := actions.GetUserById(userId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "User not found.",
		})
	}

	err = actions.DeleteUser(user)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error deleting user.",
		})
	}

	err = actions.UserLogout(c)

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
	type changePasswordInput struct {
		NewPassword string `json:"newPassword"`
	}
	code := c.Params("code")
	userId := c.Params("id")

	if code == "" {
		return c.Status(400).JSON(fiber.Map{
			"data": "No code sent in request.",
		})
	}

	// Initialize Structs
	var body changePasswordInput

	err := c.BodyParser(&body)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Invalid input.",
		})
	}

	user, err := actions.GetUserById(userId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "User was not found.",
		})
	}

	token, err := actions.GetToken(code, user.ID)

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
	err = actions.ChangePassword(user, body.NewPassword)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not change password.",
		})
	}

	// Delete Token
	err = actions.DeleteToken(token)

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
	userId := c.Params("id")
	user, err := actions.GetUserById(userId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "User was not found.",
		})
	}

	err = actions.RequestChangePasswordCode(user)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Error requesting change password code.",
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

	user, err := actions.GetUserByEmail(body.Email)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Couldn't find user using that e-mail.",
		})
	}

	err = actions.RequestChangePasswordCode(user)

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
	userId := c.Params("id")
	file, err := c.FormFile("image")

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not retrieve file from request.",
		})
	}

	user, err := actions.GetUserById(userId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "User was not found.",
		})
	}

	err = actions.ChangeProfilePicture(user, file)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not change profile picture.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": user,
	})
}
