package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type CompanyServicesLocations struct {
	*models.CompanyServicesLocations
}

type CompanyServicesLocationsSlice []*models.CompanyServicesLocations

type CompanyServiceByArea struct {
	ServiceID int    `json:"service_id"`
	Service   string `json:"service"`
	ZipCodeID int    `json:"zip_code_id"`
	ZipCode   string `json:"zip_code"`
	CityID    int    `json:"city_id"`
	City      string `json:"city"`
}

func (c *CompanyServicesLocationsSlice) GetCompanyServiceAreas(companyId int) error {
	sql := `
	SELECT s.id AS service_id, s.name AS service, z.id AS zip_code_id, z.zip_code AS zip_code, c.id AS city_id, c.name AS city
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

func (c *CompanyServicesLocationsSlice) GetServicesAreasByCompany(companyId int) error {
	return database.DB.Raw(`SELECT * FROM company_services_locations WHERE company_id = ?`, companyId).Scan(&c).Error
}

func (c *CompanyServicesLocationsSlice) CreateCompanyServiceLocations(companyId int) error {
	return database.DB.Save(&c).Where("company_id = ?", companyId).Find(&c).Error
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
