package actions

import (
	"fmt"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type CompanyServicesLocations struct {
	*models.CompanyServicesLocations
}

type CompanyServicesLocationsSlice []*models.CompanyServicesLocations

func (c *CompanyServicesLocationsSlice) GetCompanyServiceAreas(companyId int) error {
	sql := fmt.Sprintf(`SELECT * FROM company_services_locations WHERE company_id = %v`, companyId)
	return database.DB.Raw(sql).Scan(&c).Error
}

func (c *CompanyServicesLocations) DeleteServiceLocation() error {
	return database.DB.Delete(&c).Error
}

func (c *CompanyServicesLocations) FindServiceLocationByZipCode(zipCode string, companyId int) error {
	return database.DB.Where("zip_code_id = ? AND company_id = ?", zipCode).First(&c).Error
}

func (c *CompanyServicesLocations) DeleteServiceByZipCode(zipCode string, companyId int) error {
	err := c.FindServiceLocationByZipCode(zipCode, companyId)

	if err != nil {
		return err
	}

	return c.DeleteServiceLocation()
}

func (c *CompanyServicesLocations) FindServiceLocationByCity(cityId string, companyId int) error {
	sql := `
	SELECT c.service_id, c.zip_code_id, c.company_id, z.city_id
	FROM company_services_locations AS c
	LEFT JOIN zip_code AS z
	ON z.id = c.zip_code_id
	WHERE z.city_id = ? AND c.company_id = ?
	`
	return database.DB.Raw(sql, cityId, companyId).First(&c).Error
}

func (c *CompanyServicesLocations) DeleteServiceByCity(cityId string, companyId int) error {
	err := c.FindServiceLocationByCity(cityId, companyId)

	if err != nil {
		return err
	}

	return c.DeleteServiceLocation()
}
