package actions

import (
	"strconv"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type LeadLog struct {
	*models.LeadLog
}

func (l *LeadLog) Save(action string, leadId string) error {

	lead, err := strconv.Atoi(leadId)

	if err != nil {
		return err
	}

	l.Action = action
	l.CreatedAt = time.Now().Unix()
	l.LeadID = lead

	return database.DB.Save(&l).Error
}
