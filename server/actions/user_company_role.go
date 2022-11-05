package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type UserCompanyRole struct {
	*models.UserCompanyRole
}

// Create and return UserCompanyRole model.
func (u *UserCompanyRole) CreateUserCompanyRole() error {
	result := database.DB.Save(&u).First(&u)

	return result.Error
}
