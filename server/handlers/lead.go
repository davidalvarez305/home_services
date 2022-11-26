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

func UpdateLead(c *fiber.Ctx) error {
	leadId := c.Params("id")
	action := c.Query("action")
	lead := &actions.Lead{}
	input := &actions.Lead{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(action) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Action desired not included in query string.",
		})
	}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Could not parse request body.",
		})
	}

	err = lead.GetLead(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to query account details.",
		})
	}

	// Update fields which are allowed to be updated
	lead.FirstName = input.FirstName
	lead.LastName = input.LastName
	lead.Email = input.Email
	lead.PhoneNumber = input.PhoneNumber

	// Log user activity
	log := &models.LeadLog{
		Action:    action,
		CreatedAt: time.Now().Unix(),
	}

	lead.Log = append(lead.Log, log)

	err = lead.Save()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save updates.",
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

func GetQuotesByLead(c *fiber.Ctx) error {
	leadQuotes := &actions.LeadQuotes{}
	leadId := c.Params("id")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	err := leadQuotes.GetQuotesByLead(leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to query quotes.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": leadQuotes,
	})
}

func CreateQuote(c *fiber.Ctx) error {
	var input types.CreateQuoteInput
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

	// Handle Client Photos
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to process images.",
		})
	}

	clientImages, err := utils.HandleMultipleImages(form)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to upload images.",
		})
	}

	input.Photos = clientImages
	q := &actions.Quote{}

	err = q.CreateQuote(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to create quote.",
		})
	}

	// Log activity
	err = leadLog.Save("Quote created.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": q,
	})
}

func DeleteLeadQuote(c *fiber.Ctx) error {
	quote := &actions.Quote{}
	leadId := c.Params("id")
	quoteId := c.Params("quoteId")
	leadLog := &actions.LeadLog{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(quoteId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Quote ID not found in URL params.",
		})
	}

	err := quote.GetQuote(quoteId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to retrieve quote.",
		})
	}

	err = quote.DeleteQuote()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to delete quote.",
		})
	}

	// Log activity
	err = leadLog.Save("Quote deleted.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "OK",
	})
}

func UpdateQuoteAddress(c *fiber.Ctx) error {
	address := &actions.Address{}
	addr := &actions.Address{}
	leadLog := &actions.LeadLog{}
	addressId := c.Params("addressId")
	leadId := c.Params("id")
	quoteId := c.Params("quoteId")

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(quoteId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Quote ID not found in URL params.",
		})
	}

	if len(addressId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Address ID not found in URL params.",
		})
	}

	err := c.BodyParser(&address)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to parse request body.",
		})
	}

	err = addr.GetAddress(addressId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to retrieve quote.",
		})
	}

	addr.StreetAddressLine1 = address.StreetAddressLine1
	addr.StreetAddressLine2 = address.StreetAddressLine2
	addr.StreetAddressLine3 = address.StreetAddressLine3
	addr.CityID = address.CityID
	addr.StateID = address.StateID
	addr.CountryID = address.CountryID
	addr.ZipCode = address.ZipCode

	err = addr.Save()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to update address.",
		})
	}

	// Log activity
	err = leadLog.Save("Quote address updated.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(202).JSON(fiber.Map{
		"data": addr,
	})
}

func AddQuotePhotos(c *fiber.Ctx) error {
	leadId := c.Params("id")
	quoteId := c.Params("quoteId")
	leadLog := &actions.LeadLog{}

	type QuotePhotoInput struct {
		PhotoDescriptions []string `json:"photo_descriptions"`
	}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(quoteId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Quote ID not found in URL params.",
		})
	}

	var input QuotePhotoInput

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to parse request body.",
		})
	}

	// Handle Client Photos
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to process images.",
		})
	}

	clientImages, err := utils.HandleMultipleImages(form)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to upload images.",
		})
	}

	quote, err := strconv.Atoi(quoteId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save images.",
		})
	}

	// Append the URLs from the S3 bucket with the description coming from the client
	var photos actions.QuotePhotos
	for index, photo := range clientImages {
		p := models.QuotePhoto{
			ImageURL:    photo,
			Description: input.PhotoDescriptions[index],
			QuoteID:     quote,
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

func DeleteQuotePhoto(c *fiber.Ctx) error {
	leadId := c.Params("id")
	quoteId := c.Params("quoteId")
	photoId := c.Params("photoId")
	quotePhoto := &actions.QuotePhoto{}
	leadLog := &actions.LeadLog{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(quoteId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Quote ID not found in URL params.",
		})
	}

	if len(photoId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Quote ID not found in URL params.",
		})
	}

	err := quotePhoto.GetQuotePhoto(photoId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to find that photo.",
		})
	}

	err = quotePhoto.DeleteQuotePhoto()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to delete that photo.",
		})
	}

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to save images.",
		})
	}

	// Log activity
	err = leadLog.Save("Quote photos deleted.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "OK",
	})
}

func AddQuoteServices(c *fiber.Ctx) error {
	leadId := c.Params("id")
	quoteId := c.Params("quoteId")
	var quotePhoto actions.QuoteServices
	leadLog := &actions.LeadLog{}

	var input actions.CreateQuoteServices

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(quoteId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Quote ID not found in URL params.",
		})
	}

	err := c.BodyParser(&input)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to parse input.",
		})
	}

	err = quotePhoto.Save(&input, quoteId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to add services.",
		})
	}

	// Log activity
	err = leadLog.Save("Quote services added.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"data": quotePhoto,
	})
}

func DeleteQuoteServices(c *fiber.Ctx) error {
	leadId := c.Params("id")
	quoteId := c.Params("quoteId")
	serviceId := c.Params("serviceId")
	quoteService := &actions.QuoteService{}
	leadLog := &actions.LeadLog{}

	if len(leadId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Lead ID not found in URL params.",
		})
	}

	if len(quoteId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Quote ID not found in URL params.",
		})
	}

	if len(serviceId) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"data": "Quote ID not found in URL params.",
		})
	}

	err := quoteService.GetQuoteServices(serviceId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to find that service.",
		})
	}

	err = quoteService.DeleteQuoteServices()

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to delete that service.",
		})
	}

	// Log activity
	err = leadLog.Save("Services deleted from quote.", leadId)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"data": "Failed to log activity.",
		})
	}

	return c.Status(204).JSON(fiber.Map{
		"data": "OK",
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
