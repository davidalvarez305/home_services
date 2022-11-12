package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type UserCompanyRole struct {
	*models.UserCompanyRole
}

type UserCompanyRoles []*models.UserCompanyRole

// Assign a user to a company and a role.
func (u *UserCompanyRole) SaveUserCompanyRole() error {
	return database.DB.Where("user_id = ? AND company_id = ? AND role_id = ?", u.UserID, u.CompanyID, u.RoleID).Save(&u).First(&u).Error
}

// Get all users that belong to a company
func (u *UserCompanyRole) GetUserCompanyRole(userId int) error {
	return database.DB.Where("user_id = ?", userId).First(&u).Error
}
