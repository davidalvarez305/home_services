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
	return database.DB.Where("zipCode = ? AND company_id = ?", zipCode).First(&c).Error
}

func (c *CompanyServicesLocations) DeleteServiceByZipCode(zipCode string, companyId int) error {
	err := c.FindServiceLocationByZipCode(zipCode, companyId)

	if err != nil {
		return err
	}

	return c.DeleteServiceLocation()
}

func (c *CompanyServicesLocations) FindServiceLocationByCity(cityId string, companyId int) error {
	return database.DB.Where("city_id = ? AND company_id = ?", cityId, companyId).First(&c).Error
}

func (c *CompanyServicesLocations) DeleteServiceByCity(cityId string, companyId int) error {
	err := c.FindServiceLocationByCity(cityId, companyId)

	if err != nil {
		return err
	}

	return c.DeleteServiceLocation()
}
