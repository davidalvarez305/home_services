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

func (c *CompanyServicesLocationsSlice) GetCompanyServiceAreasByUser(userId int) error {
	sql := fmt.Sprintf(`
		SELECT * FROM company_services_locations WHERE company_id = (
			SELECT company_id FROM user_company_role WHERE user_id = %v
		)

	`, userId)
	return database.DB.Raw(sql).Scan(&c).Error
}

func (c *CompanyServicesLocations) DeleteServiceLocation() error {
	return database.DB.Delete(&c).Error
}

func (c *CompanyServicesLocations) FindServiceLocationByZipCode(zip_code string) error {
	return database.DB.Where("zip_code = ?", zip_code).First(&c).Error
}

func (c *CompanyServicesLocations) DeleteServiceByZipCode(zip_code string) error {
	err := c.FindServiceLocationByZipCode(zip_code)

	if err != nil {
		return err
	}

	return c.DeleteServiceLocation()
}

func (c *CompanyServicesLocations) FindServiceLocationByCity(cityId string) error {
	return database.DB.Where("city_id = ?", cityId).First(&c).Error
}

func (c *CompanyServicesLocations) DeleteServiceByCity(cityId string) error {
	err := c.FindServiceLocationByCity(cityId)

	if err != nil {
		return err
	}

	return c.DeleteServiceLocation()
}
