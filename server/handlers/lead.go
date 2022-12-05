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
	lead := &actions.Lead{}
	leadLog := &actions.LeadLog{}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	err = lead.CreateLead(&input)

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
	sms := &actions.TwillioWebhookRequestBody{}

	sms.From = input.PhoneNumber

	initialMsg := fmt.Sprintf("Welcome %s, this is just a welcome message and as a bonus, you can send images through here, and they'll be added to your account!", lead.FirstName)

	err = sms.SendSMS(initialMsg)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not send welcome message.",
		})
	}

	// Log activity
	err = leadLog.Save("Lead created.", fmt.Sprintf("%+v", lead.ID))

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
	lead := &actions.Lead{}

	err := lead.GetLeadFromSession(c)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"data": err.Error(),
		})
	}

	if lead.Lead == nil {
		return c.Status(404).JSON(fiber.Map{
			"data": "Not found.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func LeadLogin(c *fiber.Ctx) error {
	lead := &actions.Lead{}
	var input actions.LeadLogin

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	err = lead.Login(&input, c)

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

	// Initialize Structs
	lead := &actions.Lead{}
	lc := &actions.LeadCode{}

	// Retrieve Token from DB
	err := lc.GetLoginCode(code)

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

	err = lead.GetLead(fmt.Sprintf("%+v", lc.LeadID))

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Could not find that user account.",
		})
	}

	// Delete Token
	err = lc.DeleteCode()

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

	sess.Set("lead_uuid", lead.UUID)

	err = sess.Save()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"data": "Failed to save session.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func GetLeadInfo(c *fiber.Ctx) error {
	leadId := c.Params("id")
	lead := &actions.Lead{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := lead.GetLead(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to query account details.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": lead,
	})
}

func DeleteLead(c *fiber.Ctx) error {
	leadId := c.Params("id")
	lead := &actions.Lead{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := lead.Delete(leadId)

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
	lead := &actions.Lead{}

	err := lead.LeadLogout(c)

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
	leadLog := &actions.LeadLog{}

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

	l := &actions.Lead{}

	lead, err := strconv.Atoi(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Invalid Lead ID.",
		})
	}

	err = l.GetLeadWithAddress(lead)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to get lead by preloading address.",
		})
	}

	l.Address.ZipCode = input.ZipCode
	l.ServiceID = input.Service
	l.Address.StreetAddressLine1 = input.StreetAddressLine1
	l.Address.StreetAddressLine2 = input.StreetAddressLine2
	l.Address.StreetAddressLine3 = input.StreetAddressLine3
	l.Budget = input.Budget

	err = l.Save()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save lead.",
		})
	}

	// Log activity
	err = leadLog.Save("Lead details updated.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": l,
	})
}

func AddLeadPhotos(c *fiber.Ctx) error {
	leadId := c.Params("id")
	leadLog := &actions.LeadLog{}

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
	var photos actions.LeadPhotos
	for _, photo := range clientImages {
		p := models.LeadPhoto{
			ImageURL: photo,
			LeadID:   lead,
		}
		photos = append(photos, &p)
	}

	err = photos.Save()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save images.",
		})
	}

	// Log activity
	err = leadLog.Save("Quote photos added.", leadId)

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
	leadPhoto := &actions.LeadPhoto{}
	leadLog := &actions.LeadLog{}

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

	err := leadPhoto.DeleteLeadPhoto(imageUrl)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to delete that photo.",
		})
	}

	photos := &actions.PhotoURLs{}

	err = photos.GetPhotoURLsByLeadID(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not get the remaining photos.",
		})
	}

	// Log activity
	err = leadLog.Save("Lead photos deleted.", leadId)

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
	leadLog := &actions.LeadLog{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := leadLog.Save(input.Action, leadId)

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
	logs := &actions.LeadLogs{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := logs.Get(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to retrieve logs.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"data": logs,
	})
}

func RecoverUUIDCode(c *fiber.Ctx) error {
	type RecoverUUIDCodeInput struct {
		Email string `json:"email"`
	}

	var input RecoverUUIDCodeInput

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to parse request body.",
		})
	}

	lead := &actions.Lead{}

	err = lead.GetLeadByEmail(input.Email)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to find account using that e-mail.",
		})
	}

	// Send e-mail with code
	title := "Here's your account code"
	message := fmt.Sprintf("Code: %s", lead.UUID)
	err = utils.SendGmail(message, lead.Email, title)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{
		"data": "Account code was sent to your e-mail.",
	})
}
