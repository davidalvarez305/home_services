package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Address struct {
	*models.Address
}

// Create and return address model.
func (a *Address) CreateAddress() error {
	result := database.DB.Save(&a).First(&a)

	return result.Error
}
