package actions

import (
	"strconv"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

func SaveCompanyLog(action string, companyId string) error {
	company, err := strconv.Atoi(companyId)

	if err != nil {
		return err
	}

	log := models.CompanyLog{
		Action:    action,
		CreatedAt: time.Now().Unix(),
		CompanyID: company,
	}

	return database.DB.Save(&log).Error
}

func GetCompanyLogs(companyId string) ([]models.CompanyLog, error) {
	var logs []models.CompanyLog
	err := database.DB.Where("company_id = ?", companyId).Find(&logs).Error
	return logs, err
}
