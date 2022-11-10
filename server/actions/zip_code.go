package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type ZipCodes []*models.ZipCode

func (z *ZipCodes) GetZipCodesByCity(cityId int) error {
	return database.DB.Where("city_id = ?", cityId).Find(&z).Error
}
