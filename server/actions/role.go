package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Roles []*models.Role

func (r *Roles) GetAll() error {
	return database.DB.Find(&r).Error
}
