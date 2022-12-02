package actions

import (
	"fmt"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
)

type Quote struct {
	*models.Quote
}

func (q *Quote) Save() error {
	return database.DB.Save(&q).Error
}

func (q *Quote) GetQuote(quoteId string) error {
	return database.DB.Where("id = ?", quoteId).First(&q).Error
}

func (q *Quote) GetQuoteByPhoneNumber(phoneNumber string) error {

	fmt.Printf("%+v\n", phoneNumber[1:])

	sql := `
	SELECT q.id FROM quote AS q
	LEFT JOIN lead AS l
	ON l.id = q.lead_id
	WHERE l.phone_number = ?;
	`

	return database.DB.Where(sql, phoneNumber[1:]).First(&q).Error
}

func (q *Quote) DeleteQuote() error {
	return database.DB.Where("id = ?", q.ID).Delete(&q).Error
}

func (q *Quote) SaveQuote(input *types.QuoteInput, leadId int) error {

	var quote models.Quote

	quote.ID = input.ID
	quote.ZipCode = input.ZipCode

	// Only set "Created At" if ID is 0. Otherwise, it's an existing quote being updated.
	if input.ID < 1 {
		quote.CreatedAt = time.Now().Unix()
	}

	quote.UpdatedAt = time.Now().Unix()
	quote.LeadID = leadId
	quote.ServiceID = input.Service
	quote.Budget = input.Budget

	// Add address for user's quote
	quote.Address = &models.Address{
		StreetAddressLine1: input.StreetAddressLine1,
		StreetAddressLine2: input.StreetAddressLine2,
		StreetAddressLine3: input.StreetAddressLine3,
		CityID:             input.CityID,
		StateID:            input.StateID,
		CountryID:          input.CountryID,
		ZipCode:            input.ZipCode,
	}

	// Mutate quote pointer && save
	q.Quote = &quote

	return q.Save()
}
