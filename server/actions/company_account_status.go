package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type CompanyAccountStatus struct {
	*models.CompanyAccountStatus
}

// Create and return CompanyAccountStatus model.
func (a *CompanyAccountStatus) CreateCompanyAccountStatus() error {
	result := database.DB.Save(&a).First(&a)

	return result.Error
}
