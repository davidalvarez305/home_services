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

type Lead struct {
	*models.Lead
}

type LeadLogin struct {
	UUID string `json:"uuid"`
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

func (l *Lead) Save() error {
	return database.DB.Save(&l).First(&l).Error
}

func (l *Lead) Delete(leadId string) error {
	return database.DB.Where("id = ?", leadId).Delete(&l).Error
}

func (l *Lead) GetLead(leadId string) error {
	return database.DB.Where("id = ?", leadId).First(&l).Error
}

func (ld *LeadDetails) GetLeadDetails(leadId string) error {

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
	WHERE l.id = ?
	GROUP BY a.street_address_line1, a.street_address_line2, a.street_address_line3, ser.service, ser.id,
	c.city, c.id, s.id, s.state, l.id, l.email, l.uuid, l.company_id, l.first_name, l.last_name,
	l.phone_number, a.zip_code, l.created_at, l.budget, ctry.country, ctry.id;`

	return database.DB.Raw(sql, leadId).First(&ld).Error
}

func (l *Lead) GetLeadByUUID(uuid string) error {
	return database.DB.Where("uuid = ?", uuid).First(&l).Error
}

func (l *Lead) GetLeadByEmail(email string) error {
	return database.DB.Where("email = ?", email).First(&l).Error
}

// Grabs userId from session, and then performs select query from the database.
func (lead *Lead) GetLeadFromSession(c *fiber.Ctx) error {
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	leadUUID := sess.Get("lead_uuid")

	if leadUUID == nil {
		return err
	}

	err = lead.GetLeadByUUID(fmt.Sprintf("%v", leadUUID))

	return err
}

func (l *Lead) CreateLead(input *types.CreateLeadInput) error {

	l.Lead = &models.Lead{
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		UUID:        uuid.New().String(),
		Email:       input.Email,
		PhoneNumber: input.PhoneNumber,
		CreatedAt:   time.Now().Unix(),
	}

	l.Lead.LeadMarketing = &models.LeadMarketing{
		LeadID:       l.Lead.ID,
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

	z := &ZipCode{}

	err := z.GetZipCode(input.ZipCode)

	if err != nil {
		return err
	}

	// Add address for this lead
	l.Address = &models.Address{
		StreetAddressLine1: input.StreetAddressLine1,
		StreetAddressLine2: input.StreetAddressLine2,
		StreetAddressLine3: input.StreetAddressLine3,
		CityID:             z.CityID,
		StateID:            z.StateID,
		CountryID:          z.CountryID,
		ZipCode:            input.ZipCode,
	}

	l.ServiceID = input.Service
	l.Budget = input.Budget

	// Assign lead
	companyId, err := FindCompanyIDByZipCodeAndService(input.ZipCode, input.Service)

	if err != nil {
		fmt.Printf("%+v\n", "Company not found.")
	}

	l.Lead.CompanyID = companyId

	return database.DB.Save(&l).First(&l).Error
}

func (l *Lead) Login(input *LeadLogin, c *fiber.Ctx) error {

	// Find Lead by UUID
	err := l.GetLeadByUUID(input.UUID)

	if err != nil {
		return err
	}

	err = l.GenerateLeadToken()

	if err != nil {
		return err
	}

	return err
}

// Destroy session.
func (l *Lead) LeadLogout(c *fiber.Ctx) error {
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	err = sess.Destroy()

	return err
}

func (l *Lead) RecoverUUIDCode(uuid string) error {

	err := database.DB.Where("uuid = ?", uuid).First(&l).Error

	if err != nil {
		return err
	}

	title := "Your UUID Recovery Request"
	message := fmt.Sprintf("Your UUID Is: %s", l.UUID)
	err = utils.SendGmail(message, l.Email, title)

	if err != nil {
		return err
	}

	return nil
}

// Generate lead token that's used for confirming users' login request.
func (lead *Lead) GenerateLeadToken() error {
	lc := &LeadCode{}
	err := lc.GenerateLoginCode(lead.ID)

	if err != nil {
		return err
	}

	title := "Login Account Code"
	message := fmt.Sprintf("Enter this code: %s", lc.Code)
	err = utils.SendGmail(message, lead.Email, title)

	if err != nil {
		return err
	}

	return nil
}

func (l *Lead) GetLeadByPhoneNumber(phoneNumber string) error {

	sql := `
	SELECT l.id
	FROM quote AS q
	LEFT JOIN lead AS l
	ON l.id = l.lead_id
	WHERE l.phone_number = ?;`

	return database.DB.Raw(sql, phoneNumber[2:]).First(&l).Error
}

func (l *Lead) GetLeadWithAddress(lead int) error {
	return database.DB.Where("id = ?", lead).Preload("Address").Find(&l).Error
}
