package actions

import (
	"strconv"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type CompanyLog struct {
	*models.CompanyLog
}

type CompanyLogs []*models.CompanyLog

func (l *CompanyLog) Save(action string, companyId string) error {

	company, err := strconv.Atoi(companyId)

	if err != nil {
		return err
	}

	l.CompanyLog = &models.CompanyLog{
		Action:    action,
		CreatedAt: time.Now().Unix(),
		CompanyID: company,
	}

	return database.DB.Save(&l).Error
}

func (logs *CompanyLogs) Get(companyId string) error {
	return database.DB.Where("company_id = ?", companyId).Find(&logs).Error
}
