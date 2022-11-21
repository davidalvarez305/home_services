package actions

import (
	"strconv"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
)

type Company struct {
	*models.Company
}

type CompanyQuotes struct {
	ZipCode            string `json:"zip_code"`
	CreatedAt          int64  `json:"created_at"`
	StreetAddressLine1 string `json:"street_address_line_1"`
	StreetAddressLine2 string `json:"street_address_line_2"`
	StreetAddressLine3 string `json:"street_address_line_3"`
	City               string `json:"city"`
	State              string `json:"state"`
	Country            string `json:"country"`
	Services           string `json:"services"`           // string agg
	Photos             string `json:"photos"`             // string agg
	Photo_Descriptions string `json:"photo_descriptions"` // string agg
}

// Create and return company model.
func (c *Company) CreateCompany(input *types.CreateCompanyInput) error {

	// Create New Company With Default Status as 'inactive'
	// By attaching the address like this, it will create a START TRANSACTION, where both the company and address insertion must be successful.
	company := models.Company{
		Name:            input.Name,
		Logo:            input.Logo,
		AccountStatusID: 2,
		CreatedAt:       time.Now().Unix(),
		UpdatedAt:       time.Now().Unix(),
		Address: &models.Address{
			CityID:             input.City,
			StateID:            input.State,
			ZipCode:            input.ZipCode,
			CountryID:          1,
			StreetAddressLine1: input.StreetAddressLine1,
			StreetAddressLine2: input.StreetAddressLine2,
			StreetAddressLine3: input.StreetAddressLine3,
		},
	}

	c.Company = &company

	return database.DB.Save(&c).First(&c).Error
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

// Get Company from DB.
func (c *Company) CheckCompanyOwners(companyId int) (bool, error) {
	var numRows = 0
	sql := `SELECT COUNT(*) FROM "user" WHERE company_id = ? AND role_id = 1`

	res := database.DB.Where(sql, companyId)

	numRows = int(res.RowsAffected)

	return numRows > 1, res.Error
}
