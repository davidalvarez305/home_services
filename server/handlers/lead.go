package handlers

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/davidalvarez305/home_services/server/actions"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/sessions"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/gofiber/fiber/v2"
)

func CreateLead(c *fiber.Ctx) error {
	var input types.CreateLeadInput

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	lead, err := actions.CreateLead(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to create a lead.",
		})
	}

	// Send e-mail after account creation
	title := "Account Creation"
	message := fmt.Sprintf("Click here to access your account dashboard: %s", os.Getenv("CLIENT_URL")+"/account/"+lead.UUID)
	err = utils.SendGmail(message, lead.Email, title)

	if err != nil {
		return err
	}

	// This is kind of ugly...might need to rework later.
	var sms actions.TwillioWebhookRequestBody

	sms.From = input.PhoneNumber

	initialMsg := fmt.Sprintf("Welcome %s, this is just a welcome message and as a bonus, you can send images through here, and they'll be added to your account!", lead.FirstName)

	err = actions.SendSMS(initialMsg, sms)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not send welcome message.",
		})
	}

	// Log activity
	err = actions.SaveLeadLog("Lead created.", fmt.Sprintf("%+v", lead.ID))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func GetLeadFromSession(c *fiber.Ctx) error {
	lead, err := actions.GetLeadFromSession(c)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "Not found.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func LeadLogin(c *fiber.Ctx) error {
	var input actions.LeadLoginInput

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	err = actions.LeadLogin(&input, c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to send login verification code.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "Enter the code found in your e-mail.",
	})
}

func CheckLoginCode(c *fiber.Ctx) error {
	code := c.Params("code")

	if code == "" {
		return c.Status(400).JSON(fiber.Map{
			"data": "No code sent in request.",
		})
	}

	// Retrieve Token from DB
	lc, err := actions.GetLoginLeadCode(code)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Token was not found.",
		})
	}

	// Validate Code's Expiry Date
	difference := time.Now().Unix() - lc.CreatedAt

	if difference > 300 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Token expired.",
		})
	}

	// Delete Token
	err = actions.DeleteLeadCode(lc)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Could not delete code.",
		})
	}

	// If lead is found -> initialize session & send cookie to browser.
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Failed to initialize session storage.",
		})
	}

	sess.Set("lead_uuid", lc.Lead.UUID)

	err = sess.Save()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Failed to save session.",
		})
	}

	ld, err := actions.GetLeadDetails(lc.Lead.UUID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Failed to fetch user details.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": ld,
	})
}

func DeleteLead(c *fiber.Ctx) error {
	leadId := c.Params("id")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := actions.DeleteLead(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not delete lead.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "OK!",
	})
}

func LeadLogout(c *fiber.Ctx) error {
	err := actions.LeadLogout(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not logout.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "OK!",
	})
}

func UpdateLead(c *fiber.Ctx) error {
	var input types.UpdateLeadInput
	leadId := c.Params("id")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to parse request body.",
		})
	}

	l, err := actions.GetLeadWithAddress(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to get lead by preloading address.",
		})
	}

	l.FirstName = input.FirstName
	l.LastName = input.LastName
	l.Email = input.Email
	l.PhoneNumber = input.PhoneNumber
	l.Address.ZipCode = input.ZipCode
	l.Address.StreetAddressLine1 = input.StreetAddressLine1
	l.Address.StreetAddressLine2 = input.StreetAddressLine2
	l.Address.StreetAddressLine3 = input.StreetAddressLine3
	l.ServiceID = input.Service
	l.Budget = input.Budget

	err = actions.SaveLead(l)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save lead.",
		})
	}

	// Log activity
	err = actions.SaveLeadLog("Lead details updated.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	lead, err := actions.GetLeadDetails(l.UUID)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to fetch updated records.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func AddLeadPhotos(c *fiber.Ctx) error {
	leadId := c.Params("id")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	// Handle Client Photos
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to process form.",
		})
	}

	clientImages, err := utils.HandleMultipleImages(form)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to upload images.",
		})
	}

	lead, err := strconv.Atoi(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Invalid Lead ID.",
		})
	}

	// Append the URLs from the S3 bucket and save
	var photos []models.LeadPhoto
	for _, photo := range clientImages {
		p := models.LeadPhoto{
			ImageURL: photo,
			LeadID:   lead,
		}
		photos = append(photos, p)
	}

	err = actions.SaveLeadPhotos(photos)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save images.",
		})
	}

	// Log activity
	err = actions.SaveLeadLog("Quote photos added.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": photos,
	})
}

func DeleteLeadPhoto(c *fiber.Ctx) error {
	leadId := c.Params("id")
	imageUrl := c.Params("imageUrl")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(imageUrl) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Image URL not found in URL params.",
		})
	}

	err := actions.DeleteLeadPhoto(imageUrl)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to delete that photo.",
		})
	}

	photos, err := actions.GetPhotoURLsByLeadID(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not get the remaining photos.",
		})
	}

	// Log activity
	err = actions.SaveLeadLog("Lead photos deleted.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": photos,
	})
}

func CreateLog(c *fiber.Ctx) error {
	type CreateLogInput struct {
		Action string `json:"action"`
	}

	var input CreateLogInput

	leadId := c.Params("id")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := actions.SaveLeadLog(input.Action, leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save log.",
		})
	}

	return c.Status(202).JSON(fiber.Map{
		"data": "OK",
	})
}

func GetLogsByLead(c *fiber.Ctx) error {
	leadId := c.Params("id")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	logs, err := actions.GetLeadLogs(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to retrieve logs.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": logs,
	})
}
