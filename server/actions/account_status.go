package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type AccountStatuses []*models.AccountStatus

func (a *AccountStatuses) GetAll() error {
	return database.DB.Find(&a).Error
}
