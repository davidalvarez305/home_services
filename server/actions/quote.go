package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
)

type Quote struct {
	*models.Quote
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

	// Save S3 URL's as photos
	var photos []*models.QuotePhoto

	for index, img := range input.Photos {
		photos = append(photos, &models.QuotePhoto{
			ImageURL:    img,
			Description: input.PhotoDescriptions[index],
		})
	}

	q.QuotePhoto = photos

	// Append services for quote
	var services []*models.QuoteServices

	for _, service := range input.Services {
		services = append(services, &models.QuoteServices{
			ServiceID: service,
		})
	}

	q.QuoteServices = services

	return database.DB.Save(&q).First(&q).Error
}
