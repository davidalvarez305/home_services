package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
)

type Lead struct {
	*models.Lead
}

func (l *Lead) Save() error {
	return database.DB.Save(&l).First(&l).Error
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

func (l *Lead) GetLeadDetails(leadId string) error {
	return database.DB.Where("id = ?", leadId).Find(&l).Error
}
