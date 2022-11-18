package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
)

type Lead struct {
	*models.Lead
}

func (l *Lead) CreateLead(input *types.CreateLeadInput) error {

	l.FirstName = input.FirstName
	l.LastName = input.LastName
	l.Email = input.Email
	l.PhoneNumber = input.PhoneNumber

	err := database.DB.Save(&l).First(&l).Error

	if err != nil {
		return err
	}

	// Save photos
	var photos []*models.LeadPhoto
	for index, photo := range input.Photos {
		p := models.LeadPhoto{
			ImageURL:    photo,
			Description: input.PhotoDescriptions[index],
			LeadID:      l.ID,
		}
		photos = append(photos, &p)
	}

	err = database.DB.Save(&photos).Error

	if err != nil {
		return err
	}

	return nil
}
