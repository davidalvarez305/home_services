package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Location struct {
	ZipCodes  string `json:"zip_codes"`
	CityID    int    `json:"city_id"`
	City      string `json:"city"`
	CountyID  int    `json:"county_id"`
	County    string `json:"county"`
	StateID   int    `json:"state_id"`
	State     string `json:"state"`
	CountryID int    `json:"country_id"`
	Country   string `json:"country"`
}

type Locations []*Location

type States []*models.State

func (l *Locations) GetAllLocations(stateId string) error {
	sql := `
	SELECT c.id AS city_id, c.city AS city,
	s.id AS state_id, s.state AS state,
	cty.id AS county_id, cty.county AS county,
	ctry.id AS country_id, ctry.country AS county,
	string_agg(z.zip_code, ',') AS zip_codes
	FROM zip_code AS z
	LEFT JOIN city AS c
	ON c.id = z.city_id
	LEFT JOIN county AS cty
	ON cty.id = z.county_id
	LEFT JOIN state AS s
	ON s.id = z.state_id
	LEFT JOIN country AS ctry
	ON ctry.id = z.country_id
	WHERE s.id = ?
	GROUP BY c.id, c.city, s.id, s.state, cty.id, cty.county , ctry.id, ctry.country;
	`
	return database.DB.Raw(sql, stateId).Scan(&l).Error
}

func (s *States) GetAllStates() error {
	return database.DB.Find(&s).Error
}
