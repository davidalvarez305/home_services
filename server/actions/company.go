package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Company struct {
	*models.Company
}

// Create and return company model.
func (c *Company) CreateCompany() error {
	result := database.DB.Save(&c).First(&c)

	return result.Error
}
