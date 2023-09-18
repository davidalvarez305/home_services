package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type CompanyServiceByArea struct {
	ID        int    `json:"id"`
	ServiceID int    `json:"service_id"`
	Service   string `json:"service"`
	ZipCode   string `json:"zip_code"`
	CityID    int    `json:"city_id"`
	City      string `json:"city"`
}

func GetCompanyServiceAreas(companyId string) ([]CompanyServiceByArea, error) {
	var c []CompanyServiceByArea

	sql := `
	SELECT csl.id AS id, s.id AS service_id, s.service AS service, z.zip_code AS zip_code, c.id AS city_id, c.city AS city
	FROM company_services_locations AS csl
	LEFT JOIN zip_code AS z
	ON z.zip_code = csl.zip_code
	LEFT JOIN city AS c
	ON c.id = z.city_id
	LEFT JOIN service AS s
	ON s.id = csl.service_id
	WHERE csl.company_id = ?`

	err := database.DB.Raw(sql, companyId).Scan(&c).Error
	return c, err
}

// Create service areas only. Doesn't return anything.
func CreateCompanyServiceAreas(c []models.CompanyServicesLocations) error {
	return database.DB.Save(&c).Error
}

// Deletes a single location
func DeleteCompanyServiceAreas(locationId, companyId string) error {
	var locations []models.CompanyServicesLocations

	err := database.DB.Where("id = ? AND company_id = ?", locationId, companyId).Find(&locations).Error

	if err != nil {
		return err
	}

	return database.DB.Delete(&locations).Error
}
