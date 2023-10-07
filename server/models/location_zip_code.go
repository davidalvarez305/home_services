package models

type ZipCode struct {
	ZipCode   string   `gorm:"primaryKey; column:zip_code" json:"zip_code"`
	CityID    int      `json:"city_id"`
	City      *City    `gorm:"not null;column:city_id;foreignKey:CityID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"city"`
	CountyID  int      `json:"county_id"`
	County    *County  `gorm:"not null;column:county_id;foreignKey:CountyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"county"`
	StateID   int      `json:"state_id"`
	State     *State   `gorm:"not null;column:state_id;foreignKey:StateID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"state"`
	CountryID int      `json:"country_id"`
	Country   *Country `gorm:"not null;column:country_id;foreignKey:CountryID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"country"`
}
