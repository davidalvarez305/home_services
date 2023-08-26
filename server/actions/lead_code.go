package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/utils"
)

func GenerateLoginLeadCode(leadId int) (models.LeadCode, error) {

	// Create Six Digit Code for Login
	code := utils.GenerateSixDigitCode(6)

	// Initialize & Generate Token
	leadCode := models.LeadCode{
		Code:      code,
		LeadID:    leadId,
		CreatedAt: time.Now().Unix(),
	}

	err := database.DB.Save(&leadCode).First(&leadCode).Error

	return leadCode, err
}

func GetLoginLeadCode(code string) (models.LeadCode, error) {
	var leadCode models.LeadCode
	err := database.DB.Where("code = ?", code).Preload("Lead").First(&leadCode).Error
	return leadCode, err
}

func DeleteLeadCode(leadCode models.LeadCode) error {
	return database.DB.Where("code = ? AND lead_id = ?", leadCode.Code, leadCode.LeadID).Delete(&leadCode).Error
}
