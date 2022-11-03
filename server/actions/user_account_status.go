package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type UserAccountStatus struct {
	*models.UserAccountStatus
}

// Save and return user account status.
func (u *UserAccountStatus) Save() error {
	result := database.DB.Save(&u).First(&u)

	return result.Error
}

// Create new user with default account status being inactive.
func (u *UserAccountStatus) CreateUserAccountStatus(user *User) error {

	u.UserAccountStatus = &models.UserAccountStatus{
		UserID:          user.ID,
		AccountStatusID: 2,
		CreatedAt:       time.Now().Unix(),
		UpdatedAt:       time.Now().Unix(),
	}

	err := u.Save()

	return err
}
