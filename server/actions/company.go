package actions

import (
	"strconv"
	"time"

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

// Update and return company model.
func (c *Company) UpdateCompany(companyId string, input models.Company) error {

	id, err := strconv.Atoi(companyId)

	if err != nil {
		return err
	}

	err = c.GetCompanyByID(id)

	if err != nil {
		return err
	}

	// Update fields that are allowed to be updated
	c.AccountStatusID = input.AccountStatusID
	c.Logo = input.Logo
	c.Name = input.Name
	c.UpdatedAt = time.Now().Unix()

	return database.DB.Save(&c).First(&c).Error
}

// Delete company model.
func (c *Company) DeleteCompany(companyId string) error {

	id, err := strconv.Atoi(companyId)

	if err != nil {
		return err
	}

	// First check to see that this company exists.
	err = c.GetCompanyByID(id)

	if err != nil {
		return err
	}

	return database.DB.Delete(&c).Error
}

// Get Company from DB.
func (c *Company) GetCompanyByID(id int) error {
	return database.DB.Where("id = ?", id).First(&c).Error
}
