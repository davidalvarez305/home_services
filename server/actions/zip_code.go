package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

func GetZipCode(zip_code string) (models.ZipCode, error) {
	var zipCode models.ZipCode
	err := database.DB.Where("zip_code = ?", zip_code).First(&zipCode).Error
	return zipCode, err
}
