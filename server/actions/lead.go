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
)

type Lead struct {
	*models.Lead
}

type LeadLogin struct {
	UUID string `json:"uuid"`
}

type LeadQuote struct {
	StreetAddressLine1 string `json:"street_address_line_1"`
	StreetAddressLine2 string `json:"street_address_line_2"`
	StreetAddressLine3 string `json:"street_address_line_3"`
	City               string `json:"city"`
	CityID             int    `json:"city_id"`
	StateID            int    `json:"state_id"`
	State              string `json:"state"`
	ZipCode            string `json:"zip_code"`
	CreatedAt          int64  `json:"created_at"`
	Services           string `json:"services"`           // string separated by commas
	Photos             string `json:"photos"`             // string separated by commas
	PhotoDescriptions  string `json:"photo_descriptions"` // string separated by commas
}

type LeadQuotes []*LeadQuote

func (l *Lead) Save() error {
	return database.DB.Save(&l).First(&l).Error
}

func (l *Lead) Delete(leadId string) error {
	return database.DB.Where("id = ?", leadId).Delete(&l).Error
}

func (l *Lead) GetLead(leadId string) error {
	return database.DB.Where("id = ?", leadId).First(&l).Error
}

func (l *Lead) GetLeadByUUID(uuid string) error {
	return database.DB.Where("uuid = ?", uuid).First(&l).Error
}

func (l *Lead) CreateLead(input *types.CreateLeadInput) error {

	l.FirstName = input.FirstName
	l.LastName = input.LastName
	l.Email = input.Email
	l.PhoneNumber = input.PhoneNumber
	l.CreatedAt = time.Now().Unix()

	l.LeadMarketing = &models.LeadMarketing{
		Campaign:     input.Campaign,
		Source:       input.Source,
		Medium:       input.Medium,
		CampaignName: input.CampaignName,
		LeadChannel:  input.LeadChannel,
		ReferralURL:  input.ReferralURL,
		Keywords:     input.Keywords,
	}

	// Create quote
	q := &models.Quote{}

	addr := models.Address{
		ZipCode:            input.ZipCode,
		StreetAddressLine1: input.StreetAddressLine1,
		StreetAddressLine2: input.StreetAddressLine2,
		StreetAddressLine3: input.StreetAddressLine3,
		CityID:             input.CityID,
		StateID:            input.StateID,
		CountryID:          input.CountryID,
	}

	q.Address = &addr
	q.CreatedAt = time.Now().Unix()
	q.UpdatedAt = time.Now().Unix()
	q.LeadID = l.ID
	q.ZipCode = input.ZipCode

	// Append the URLs from the S3 bucket with the description coming from the client
	var photos []*models.QuotePhoto
	for index, photo := range input.Photos {
		p := models.QuotePhoto{
			ImageURL:    photo,
			Description: input.PhotoDescriptions[index],
			QuoteID:     q.ID,
		}
		photos = append(photos, &p)
	}

	q.QuotePhoto = photos

	// Append quote services by ID
	qs := []*models.QuoteServices{}
	for _, service := range input.Services {
		qs = append(qs, &models.QuoteServices{
			ServiceID: service,
		})
	}

	q.QuoteServices = qs

	// Append the quote to the lead and save everything in a SQL transaction
	l.Quote = append(l.Quote, q)

	// Create log for initial lead creation
	l.Log = append(l.Log, &models.LeadLog{
		Action:    "Initial lead creation",
		CreatedAt: time.Now().Unix(),
	})

	err := database.DB.Save(&l).First(&l).Error

	if err != nil {
		return err
	}

	return nil
}

func (l *Lead) Login(input *LeadLogin, c *fiber.Ctx) error {
	// Find Lead by UUID
	err := l.GetLeadByUUID(input.UUID)

	if err != nil {
		return err
	}

	// If lead is found -> initialize session & send cookie to browser.
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return err
	}

	sess.Set("lead_uuid", l.UUID)

	err = sess.Save()

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

// Get all of the quotes generated by a user.
func (lq *LeadQuotes) GetQuotesByLead(leadId string) error {
	sql := `
	SELECT a.street_address_line1 AS street_address_line_1, a.street_address_line2 AS street_address_line_2, a.street_address_line3 AS street_address_line_3,
	c.city, c.id AS city_id, s.state, s.id AS state_id, q.zip_code, ser.service,
	qp.image_url AS photos string_agg(qp.image_url, ',') AS photos,
	qp.description AS photo_descriptions string_agg(qp.description, ',') AS photo_descriptions,
	FROM quote AS q
	LEFT JOIN quote_services AS qs
	on qs.quote_id  = q.id
	LEFT JOIN service AS ser
	on ser.id = qs.service_id
	LEFT JOIN quote_photos AS qp 
	on qp.quote_id = q.id
	LEFT JOIN address AS a
	ON a.id = q.address_id
	LEFT JOIN zip_code AS z
	ON z.zip_code = q.zip_code
	LEFT JOIN city AS c
	ON c.id = z.city_id
	LEFT JOIN state AS s
	ON s.id = z.state_id
	WHERE q.lead_id = ?;
	`

	return database.DB.Raw(sql, leadId).Scan(&lq).Error
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
