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

type LeadLogs []*models.LeadLog

func (l *LeadLog) Save(action string, leadId string) error {

	lead, err := strconv.Atoi(leadId)

	if err != nil {
		return err
	}

	l.LeadLog = &models.LeadLog{
		Action:    action,
		CreatedAt: time.Now().Unix(),
		LeadID:    lead,
	}

	return database.DB.Save(&l).Error
}

func (logs *LeadLogs) Get(leadId string) error {
	return database.DB.Where("lead_id = ?", leadId).Find(&logs).Error
}
