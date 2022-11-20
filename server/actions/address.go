package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Address struct {
	*models.Address
}

func (a *Address) Save() error {
	return database.DB.Save(&a).First(&a).Error
}

func (a *Address) GetAddress(addressId string) error {
	return database.DB.Where("id = ?", addressId).First(&a).Error
}
