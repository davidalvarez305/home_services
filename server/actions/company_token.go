package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/google/uuid"
)

func GenerateCompanyToken(companyId int, email string) (models.CompanyToken, error) {
	// Create UUID for CompanyToken
	uuid := uuid.New().String()

	// Initialize & Generate CompanyToken
	companyToken := models.CompanyToken{
		UUID:      uuid,
		CompanyID: companyId,
		Email:     email,
		CreatedAt: time.Now().Unix(),
	}

	err := database.DB.Save(&companyToken).Preload("Company").First(&companyToken).Error

	return companyToken, err
}

func GetCompanyToken(uuid string) (models.CompanyToken, error) {
	var companyToken models.CompanyToken
	err := database.DB.Where("uuid = ?", uuid).First(&companyToken).Error
	return companyToken, err
}

func DeleteCompanyToken(companyToken models.CompanyToken) error {
	return database.DB.Delete(&companyToken).Error
}
