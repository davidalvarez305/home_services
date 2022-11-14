package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type States []*models.Service

func (s *States) GetAllStates() error {
	return database.DB.Find(&s).Error
}
