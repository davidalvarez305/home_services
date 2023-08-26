package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type LeadPhotoURL struct {
	ImageURL string `json:"image_url"`
}

// Save single Lead Photos
func SaveLeadPhoto(leadPhoto models.LeadPhoto) error {
	return database.DB.Save(&leadPhoto).First(&leadPhoto).Error
}

func DeleteLeadPhoto(imageUrl string) error {
	var leadPhoto models.LeadPhoto
	return database.DB.Where("image_url = ?", imageUrl).Find(&leadPhoto).Delete(&leadPhoto).Error
}

func GetPhotoURLsByLeadID(leadId string) ([]LeadPhotoURL, error) {
	var photoUrls []LeadPhotoURL
	err := database.DB.Raw("SELECT image_url FROM lead_photo WHERE lead_id = ?", leadId).Scan(&photoUrls).Error
	return photoUrls, err
}

// Save multiple Lead Photos
func SaveLeadPhotos(leadPhotos []models.LeadPhoto) error {
	return database.DB.Save(&leadPhotos).Find(&leadPhotos).Error
}
