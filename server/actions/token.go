package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/google/uuid"
)

func generateToken(userId int) (models.Token, error) {

	// Create UUID for Token
	uuid := uuid.New().String()

	// Initialize & Generate Token
	token := models.Token{
		UUID:      uuid,
		UserID:    userId,
		CreatedAt: time.Now().Unix(),
	}

	err := database.DB.Save(&token).First(&token).Error

	return token, err
}

func GetToken(uuid string, userId int) (models.Token, error) {
	var token models.Token
	err := database.DB.Where("uuid = ? AND user_id = ?", uuid, userId).First(&token).Error
	return token, err
}

func DeleteToken(token models.Token) error {
	return database.DB.Delete(&token).Error
}
