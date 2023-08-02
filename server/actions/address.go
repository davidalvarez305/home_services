package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

func SaveAddress(address models.User) (models.Address, error) {
	var newAddress models.Address
	err := database.DB.Save(&address).First(&newAddress).Error
	return newAddress, err
}

func GetAddress(addressId string) (models.Address, error) {
	var address models.Address
	err := database.DB.Where("id = ?", addressId).First(&address).Error
	return address, err
}
