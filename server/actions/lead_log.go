package actions

import (
	"strconv"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

func SaveLeadLog(action string, leadId string) error {

	lead, err := strconv.Atoi(leadId)

	if err != nil {
		return err
	}

	leadLog := models.LeadLog{
		Action:    action,
		CreatedAt: time.Now().Unix(),
		LeadID:    lead,
	}

	return database.DB.Save(&leadLog).Error
}

func GetLeadLogs(leadId string) ([]models.LeadLog, error) {
	var leadLogs []models.LeadLog
	err := database.DB.Where("lead_id = ?", leadId).Find(&leadLogs).Error
	return leadLogs, err
}
