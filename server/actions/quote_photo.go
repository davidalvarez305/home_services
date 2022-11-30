package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type QuotePhoto struct {
	*models.QuotePhoto
}

type QuotePhotos []*models.QuotePhoto

type QuotePhotoURL struct {
	ImageURL string `json:"image_url"`
}

type PhotoURLs []*QuotePhotoURL

// Save single Quote Photos
func (q *QuotePhoto) Save() error {
	return database.DB.Save(&q).First(&q).Error
}

func (q *QuotePhoto) DeleteQuotePhoto(imageUrl string) error {
	return database.DB.Where("image_url = ?", imageUrl).Delete(&q).Error
}

func (q *PhotoURLs) GetPhotoURLsByQuoteID(quoteId string) error {
	return database.DB.Raw("SELECT image_url FROM quote_photo WHERE quote_id = ?", quoteId).Scan(&q).Error
}

// Save multiple Quote Photos
func (q *QuotePhotos) Save() error {
	return database.DB.Save(&q).Find(&q).Error
}
