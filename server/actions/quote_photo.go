package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type QuotePhoto struct {
	*models.QuotePhoto
}

type QuotePhotos []*models.QuotePhoto

// Save single Quote Photos
func (q *QuotePhoto) Save() error {
	return database.DB.Save(&q).First(&q).Error
}

func (q *QuotePhoto) GetQuotePhoto(imageUrl string) error {
	return database.DB.Where("image_url = ?", imageUrl).First(&q).Error
}

func (q *QuotePhoto) DeleteQuotePhoto() error {
	return database.DB.Where("id = ?", q.ID).Delete(&q).Error
}

// Save multiple Quote Photos
func (q *QuotePhotos) Save() error {
	return database.DB.Save(&q).Find(&q).Error
}
