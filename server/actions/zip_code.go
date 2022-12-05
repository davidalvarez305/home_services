package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type ZipCode struct {
	*models.ZipCode
}

func (z *ZipCode) GetZipCode(zip_code string) error {
	return database.DB.Where("zip_code = ?", zip_code).First(&z).Error
}
