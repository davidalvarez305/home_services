package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

func GetAll() ([]models.Role, error) {
	var roles []models.Role
	err := database.DB.Find(&roles).Error
	return roles, err
}
