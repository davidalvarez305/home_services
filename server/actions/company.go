package actions

import (
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/davidalvarez305/home_services/server/types"
)

type Company struct {
	*models.Company
}

type CompanyLead struct {
	ID                 int    `json:"id"`
	Email              string `json:"email"`
	FirstName          string `json:"first_name"`
	LastName           string `json:"last_name"`
	PhoneNumber        string `json:"phone_number"`
	CompanyID          int    `json:"company_id"`
	StreetAddressLine1 string `json:"street_address_line_1"`
	StreetAddressLine2 string `json:"street_address_line_2"`
	StreetAddressLine3 string `json:"street_address_line_3"`
	City               string `json:"city"`
	CityID             int    `json:"city_id"`
	State              string `json:"state"`
	StateID            int    `json:"state_id"`
	Country            string `json:"country"`
	CountryID          int    `json:"country_id"`
	ZipCode            string `json:"zip_code"`
	CreatedAt          int64  `json:"created_at"`
	Service            string `json:"service"`
	ServiceID          int    `json:"service_id"`
	Photos             string `json:"photos"` // string separated by commas
	Budget             int    `json:"budget"`
	// Eventually I will add things like lead_score
}

type CompanyLeads []*CompanyLead

func (c *Company) Save() error {
	return database.DB.Save(&c).First(&c).Error
}

// Create and return company model.
func (c *Company) CreateCompany(input *types.CreateCompanyInput, user *User) error {
	user.User.RoleID = 2
	user.User.UpdatedAt = time.Now().Unix()

	var users Users

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
		// Create company with authenticated user set as 'Owner' as default
		Users: append(users, user.User),
	}

	c.Company = &company

	return database.DB.Save(&c).First(&c).Error
}

// Update and return company model.
func (c *Company) UpdateCompany(companyId string, input models.Company) error {

	err := c.GetCompanyByID(companyId)

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

	// First check to see that this company exists.
	err := c.GetCompanyByID(companyId)

	if err != nil {
		return err
	}

	return database.DB.Delete(&c).Error
}

// Get Company from DB.
func (c *Company) GetCompanyByID(id string) error {
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

func (cl *CompanyLeads) GetCompanyLeads(companyId, offset, limit string) error {
	sql := `
	SELECT l.email, l.company_id, l.first_name, l.last_name, l.phone_number, l.budget, l.created_at, 
	a.street_address_line1, a.street_address_line2, a.street_address_line3, a.zip_code,
	city.city, c.id AS city_id, s.state, s.id AS state_id, ctry.country, ctry.id AS country_id,
	ser.service, ser.id AS service_id,
	string_agg(lp.image_url, ',') AS photos
	FROM company AS c
	left join lead as l
	on l.company_id  = c.id
	LEFT JOIN service AS ser
	on ser.id = l.service_id
	LEFT JOIN lead_photo AS lp 
	on lp.lead_id = l.id
	LEFT JOIN address AS a
	ON a.id = l.address_id
	LEFT JOIN city AS city
	ON city.id = a.city_id
	LEFT JOIN state AS s
	ON s.id = a.state_id
	LEFT JOIN country AS ctry
	ON ctry.id = a.country_id
	WHERE c.id = ?
	GROUP BY c.id, a.street_address_line1, a.street_address_line2, a.street_address_line3, ser.service, ser.id,
	city.city, city.id, s.id, s.state, l.email, l.company_id, l.first_name, l.last_name,
	l.phone_number, a.zip_code, l.created_at, l.budget, ctry.country, ctry.id
	OFFSET ?
	LIMIT ?;`

	return database.DB.Raw(sql, companyId, offset, limit).Scan(&cl).Error
}

// Get Company from DB.
func FindCompanyIDByZipCodeAndService(zipCode string, serviceID int) (int, error) {
	var companyId int

	sql := `
	SELECT c.id
	FROM company_services_locations AS csl
	LEFT JOIN company AS c
	ON csl.company_id = c.id
	WHERE csl.zip_code = ? AND csl.service_id = ?
	GROUP BY csl.zip_code, csl.service_id, c.id;
	`

	res := database.DB.Where(sql, zipCode, serviceID).First(&companyId)

	return companyId, res.Error
}
