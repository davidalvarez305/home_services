package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
)

type Quote struct {
	*models.Quote
}

func (q *Quote) Save() error {
	return database.DB.Save(&q).First(&q).Error
}

func (q *Quote) GetQuote(quoteId string) error {
	return database.DB.Where("id = ?", quoteId).First(&q).Error
}

func (q *Quote) DeleteQuote() error {
	return database.DB.Where("id = ?", q.ID).Delete(&q).Error
}

func (q *Quote) CreateQuote(input *types.CreateQuoteInput) error {

	// Add address for user's quote
	q.Address = &models.Address{
		StreetAddressLine1: input.StreetAddressLine1,
		StreetAddressLine2: input.StreetAddressLine2,
		StreetAddressLine3: input.StreetAddressLine3,
		CityID:             input.CityID,
		StateID:            input.StateID,
		CountryID:          input.CountryID,
	}

	// Append services for quote
	var services []*models.QuoteServices

	for _, service := range input.Services {
		services = append(services, &models.QuoteServices{
			ServiceID: service,
		})
	}

	q.QuoteServices = services

	return q.Save()
}
