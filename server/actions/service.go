package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

func GetAllServices() ([]models.Service, error) {
	var services []models.Service
	err := database.DB.Find(&services).Error
	return services, err
}
