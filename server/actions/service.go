package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Services []*models.Service

func (s *Services) GetAllServices() error {
	return database.DB.Find(&s).Error
}
