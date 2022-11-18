package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type LeadLog struct {
	*models.LeadLog
}

func (l *LeadLog) Save() error {
	return database.DB.Save(&l).First(&l).Error
}
