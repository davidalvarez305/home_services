package actions

import (
	"strconv"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type QuoteService struct {
	*models.QuoteServices
}

type QuoteServices []*models.QuoteServices

type CreateQuoteServices struct {
	Services []int `json:"services"`
}

// Save single Quote Services
// Cannot be pointer receiver because otherwise the append method doesn't work
func (q QuoteServices) Save(input *CreateQuoteServices, quote string) error {

	quoteId, err := strconv.Atoi(quote)

	if err != nil {
		return err
	}

	for _, service := range input.Services {
		q = append(q, &models.QuoteServices{
			ServiceID: service,
			QuoteID:   quoteId,
		})
	}

	return database.DB.Save(&q).Find(&q).Error
}

func (q *QuoteService) GetQuoteServices(servicesId string) error {
	return database.DB.Where("id = ?", servicesId).First(&q).Error
}

func (q *QuoteService) DeleteQuoteServices() error {
	return database.DB.Delete(&q).Error
}
