package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/google/uuid"
)

type CompanyToken struct {
	*models.CompanyToken
}

func (c *CompanyToken) GenerateCompanyToken(companyId int, email string) error {

	// Create UUID for CompanyToken
	uuid := uuid.New().String()

	// Initialize & Generate CompanyToken
	t := models.CompanyToken{
		UUID:      uuid,
		CompanyID: companyId,
		Email:     email,
		CreatedAt: time.Now().Unix(),
	}

	// Assign CompanyToken to struct
	c.CompanyToken = &t

	result := database.DB.Save(&c).First(&c)

	return result.Error
}

func (CompanyToken *CompanyToken) GetCompanyToken(uuid string, email string) error {
	result := database.DB.Where("uuid = ? AND email = ?", uuid, email).First(&CompanyToken)
	return result.Error
}

func (CompanyToken *CompanyToken) DeleteCompanyToken() error {
	result := database.DB.Delete(&CompanyToken)
	return result.Error
}
