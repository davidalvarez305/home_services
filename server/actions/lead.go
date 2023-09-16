package actions

import (
	"fmt"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/sessions"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type LeadLoginInput struct {
	Email string `json:"email"`
}

type LeadDetails struct {
	ID                 int    `json:"id"`
	Email              string `json:"email"`
	UUID               string `json:"uuid"`
	FirstName          string `json:"first_name"`
	LastName           string `json:"last_name"`
	PhoneNumber        string `json:"phone_number"`
	CompanyID          int    `json:"company_id"`
	StreetAddressLine1 string `json:"street_address_line_1"`
	StreetAddressLine2 string `json:"street_address_line_2"`
	StreetAddressLine3 string `json:"street_address_line_3"`
	City               string `json:"city"`
	CityID             int    `json:"city_id"`
	State              string `json:"state"`
	StateID            int    `json:"state_id"`
	Country            string `json:"country"`
	CountryID          int    `json:"country_id"`
	ZipCode            string `json:"zip_code"`
	CreatedAt          int64  `json:"created_at"`
	Service            string `json:"service"`
	ServiceID          int    `json:"service_id"`
	Photos             string `json:"photos"` // string separated by commas
	Budget             int    `json:"budget"`
}

func SaveLead(lead models.Lead) error {
	return database.DB.Save(&lead).First(&lead).Error
}

func DeleteLead(leadId string) error {
	var lead models.Lead
	return database.DB.Where("id = ?", leadId).Find(&lead).Delete(&lead).Error
}

func GetLead(leadId string) (models.Lead, error) {
	var lead models.Lead
	err := database.DB.Where("id = ?", leadId).First(&lead).Error
	return lead, err
}

func GetLeadDetails(uuid string) (LeadDetails, error) {
	var leadDetails LeadDetails
	sql := `
	SELECT l.id, l.email, l.uuid, l.company_id, l.first_name, l.last_name, l.phone_number, l.budget, l.created_at, 
	a.street_address_line1, a.street_address_line2, a.street_address_line3, a.zip_code,
	c.city, c.id AS city_id, s.state, s.id AS state_id, ctry.country, ctry.id AS country_id,
	ser.service, ser.id AS service_id,
	string_agg(lp.image_url, ',') AS photos
	FROM lead AS l
	LEFT JOIN service AS ser
	on ser.id = l.service_id
	LEFT JOIN lead_photo AS lp 
	on lp.lead_id = l.id
	LEFT JOIN address AS a
	ON a.id = l.address_id
	LEFT JOIN city AS c
	ON c.id = a.city_id
	LEFT JOIN state AS s
	ON s.id = a.state_id
	LEFT JOIN country AS ctry
	ON ctry.id = a.country_id
	WHERE l.uuid = ?
	GROUP BY a.street_address_line1, a.street_address_line2, a.street_address_line3, ser.service, ser.id,
	c.city, c.id, s.id, s.state, l.id, l.email, l.uuid, l.company_id, l.first_name, l.last_name,
	l.phone_number, a.zip_code, l.created_at, l.budget, ctry.country, ctry.id;`

	err := database.DB.Raw(sql, uuid).First(&leadDetails).Error

	return leadDetails, err
}

func GetLeadByUUID(uuid string) (models.Lead, error) {
	var lead models.Lead
	err := database.DB.Where("uuid = ?", uuid).First(&lead).Error
	return lead, err
}

func GetLeadByEmail(email string) (models.Lead, error) {
	var lead models.Lead
	err := database.DB.Where("email = ?", email).First(&lead).Error
	return lead, err
}

func GetLeadsByDates(companyId int, from, to int64) ([]models.Lead, error) {
	var leads []models.Lead
	err := database.DB.Where("company_id = ? AND created_at > ? AND created_at < ?", companyId, from, to).Find(&leads).Error
	return leads, err
}

// Grabs userId from session, and then performs select query from the database.
func GetLeadFromSession(c *fiber.Ctx) (LeadDetails, error) {
	var leadDetails LeadDetails
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return leadDetails, err
	}

	leadUUID := sess.Get("lead_uuid")

	if leadUUID == nil {
		return leadDetails, err
	}

	leadDetails, err = GetLeadDetails(fmt.Sprintf("%v", leadUUID))

	return leadDetails, err
}

func CreateLead(input *types.CreateLeadInput) (models.Lead, error) {
	var lead = models.Lead{
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		UUID:        uuid.New().String(),
		Email:       input.Email,
		PhoneNumber: input.PhoneNumber,
		CreatedAt:   time.Now().Unix(),
	}

	lead.LeadMarketing = &models.LeadMarketing{
		LeadID:       lead.ID,
		Source:       input.Source,
		Medium:       input.Medium,
		LeadChannel:  input.LeadChannel,
		LandingPage:  input.LandingPage,
		Keyword:      input.Keyword,
		Referrer:     input.Referrer,
		Gclid:        input.Gclid,
		CampaignID:   input.CampaignID,
		CampaignName: input.CampaignName,
		AdGroupID:    input.AdGroupID,
		AdGroupName:  input.AdGroupName,
		AdSetID:      input.AdSetID,
		AdSetName:    input.AdSetName,
		AdID:         input.AdID,
		AdHeadline:   input.AdHeadline,
	}

	zip, err := GetZipCode(input.ZipCode)

	if err != nil {
		return lead, err
	}

	// Add address for this lead
	lead.Address = &models.Address{
		StreetAddressLine1: input.StreetAddressLine1,
		StreetAddressLine2: input.StreetAddressLine2,
		StreetAddressLine3: input.StreetAddressLine3,
		CityID:             zip.CityID,
		StateID:            zip.StateID,
		CountryID:          zip.CountryID,
		ZipCode:            input.ZipCode,
	}

	lead.ServiceID = input.Service
	lead.Budget = input.Budget

	// Assign lead
	companyId, err := FindCompanyIDByZipCodeAndService(input.ZipCode, input.Service)

	if err != nil {
		fmt.Printf("%+v\n", "Company not found.")
	}

	lead.CompanyID = companyId

	var createdLead models.Lead

	err = database.DB.Save(&lead).First(&createdLead).Error

	return createdLead, err
}

func LeadLogin(input *LeadLoginInput, c *fiber.Ctx) error {

	// Find Lead by UUID
	lead, err := GetLeadByEmail(input.Email)

	if err != nil {
		return err
	}

	_, err = GenerateLeadToken(lead)

	if err != nil {
		return err
	}

	return err
}

// Destroy session.
func LeadLogout(c *fiber.Ctx) error {
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	err = sess.Destroy()

	return err
}

func RecoverUUIDCode(uuid string) error {
	var lead models.Lead

	err := database.DB.Where("uuid = ?", uuid).First(&lead).Error

	if err != nil {
		return err
	}

	title := "Your UUID Recovery Request"
	message := fmt.Sprintf("Your UUID Is: %s", lead.UUID)
	err = utils.SendGmail(message, lead.Email, title)

	if err != nil {
		return err
	}

	return nil
}

// Generate lead token that's used for confirming users' login request.
func GenerateLeadToken(lead models.Lead) (models.LeadCode, error) {
	leadCode, err := GenerateLoginLeadCode(lead.ID)

	if err != nil {
		return leadCode, err
	}

	title := "Login Account Code"
	message := fmt.Sprintf("Enter this code: %s", leadCode.Code)
	err = utils.SendGmail(message, lead.Email, title)

	if err != nil {
		return leadCode, err
	}

	return leadCode, err
}

func GetLeadByPhoneNumber(phoneNumber string) (models.Lead, error) {
	var lead models.Lead
	err := database.DB.Where("phone_number = ?", phoneNumber[2:]).First(&lead).Error
	return lead, err
}

func GetLeadWithAddress(id string) (models.Lead, error) {
	var lead models.Lead
	err := database.DB.Where("id = ?", id).Preload("Address").Find(&lead).Error
	return lead, err
}
