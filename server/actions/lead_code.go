package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/utils"
)

type LeadCode struct {
	*models.LeadCode
}

func (lc *LeadCode) GenerateLoginCode(leadId int) error {

	// Create Six Digit Code for Login
	code := utils.GenerateSixDigitCode(6)

	// Initialize & Generate Token
	t := models.LeadCode{
		Code:      code,
		LeadID:    leadId,
		CreatedAt: time.Now().Unix(),
	}

	// Assign token to struct
	lc.LeadCode = &t

	result := database.DB.Save(&lc).First(&lc)

	return result.Error
}

func (lc *LeadCode) GetLoginCode(code string) error {
	return database.DB.Where("code = ?", code).Preload("Lead").First(&lc).Error
}

func (lc *LeadCode) DeleteCode() error {
	return database.DB.Where("code = ? AND lead_id = ?", lc.Code, lc.LeadID).Delete(&lc).Error
}
