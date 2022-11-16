package actions

import (
	"fmt"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type CompanyLocation struct {
	*models.CompanyServicesLocations
}

type CompanyServicesLocations []*models.CompanyServicesLocations

type CompanyServiceByArea struct {
	ServiceID int    `json:"service_id"`
	Service   string `json:"service"`
	ZipCodeID int    `json:"zip_code_id"`
	ZipCode   string `json:"zip_code"`
	CityID    int    `json:"city_id"`
	City      string `json:"city"`
}

type CompanyServicesByArea []*CompanyServiceByArea

func (c *CompanyServicesByArea) GetCompanyServiceAreas(companyId string) error {
	sql := `
	SELECT s.id AS service_id, s.service AS service, z.id AS zip_code_id, z.zip_code AS zip_code, c.id AS city_id, c.city AS city
	FROM company_services_locations AS csl
	LEFT JOIN zip_code AS z
	ON z.id = csl.zip_code_id
	LEFT JOIN city AS c
	ON c.id = z.city_id
	LEFT JOIN service AS s
	ON s.id = csl.service_id
	WHERE csl.company_id = ?`
	return database.DB.Raw(sql, companyId).Scan(&c).Error
}

// Create service areas only. Doesn't return anything.
func (c *CompanyServicesLocations) CreateCompanyServiceAreas() error {
	return database.DB.Save(&c).Error
}

func (c *CompanyServicesLocations) CheckPermissions(companyId string, user *User) bool {

	// Check that the services are all being added to the company from the URL params
	for _, service := range *c {
		if fmt.Sprintf("%+v", service.CompanyID) != companyId {
			return false
		}
	}

	// Check that user's company is the same as the company in the URL params
	if fmt.Sprintf("%+v", user.CompanyID) != companyId {
		return false
	}

	if user.RoleID != 1 || user.AccountStatusID != 1 {
		return false
	}

	return true
}

// Deletes a single location
func (c *CompanyLocation) DeleteCompanyServiceArea() error {
	return database.DB.Delete(&c).Error
}
