package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type LeadPhoto struct {
	*models.LeadPhoto
}

type LeadPhotos []*models.LeadPhoto

type LeadPhotoURL struct {
	ImageURL string `json:"image_url"`
}

type PhotoURLs []*LeadPhotoURL

// Save single Lead Photos
func (l *LeadPhoto) Save() error {
	return database.DB.Save(&l).First(&l).Error
}

func (l *LeadPhoto) DeleteLeadPhoto(imageUrl string) error {
	return database.DB.Where("image_url = ?", imageUrl).Delete(&l).Error
}

func (l *PhotoURLs) GetPhotoURLsByLeadID(leadId string) error {
	return database.DB.Raw("SELECT image_url FROM lead_photo WHERE lead_id = ?", leadId).Scan(&l).Error
}

// Save multiple Lead Photos
func (l *LeadPhotos) Save() error {
	return database.DB.Save(&l).Find(&l).Error
}
