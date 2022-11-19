package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/sessions"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/gofiber/fiber/v2"
)

type Lead struct {
	*models.Lead
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

	err := database.DB.Save(&l).First(&l).Error

	if err != nil {
		return err
	}

	// Save photos
	var photos []*models.QuotePhoto
	for index, photo := range input.Photos {
		p := models.QuotePhoto{
			ImageURL:    photo,
			Description: input.PhotoDescriptions[index],
			QuoteID:     q.ID,
		}
		photos = append(photos, &p)
	}

	err = database.DB.Save(&photos).Error

	if err != nil {
		return err
	}

	return nil
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

// Destroy session.
func (lq *LeadQuotes) GetQuotesByLead(leadId string) error {
	sql := `
	SELECT a.street_address_line1 AS street_address_line_1, a.street_address_line2 AS street_address_line_2, a.street_address_line3 AS street_address_line_3,
	c.city, c.id AS city_id, s.state, s.id AS state_id, q.zip_code,
	ser.service, qp.image_url AS photos, qp.description  AS photo_descriptions
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
