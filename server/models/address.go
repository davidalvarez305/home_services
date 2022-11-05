package models

type Address struct {
	ID                 int      `json:"id"`
	StreetAddressLine1 string   `json:"street_address_line_1"`
	StreetAddressLine2 string   `json:"street_address_line_2"`
	StreetAddressLine3 string   `json:"street_address_line_3"`
	CompanyID          int      `json:"company_id"`
	Company            *Company `gorm:"not null;column:company_id;foreignKey:CompanyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CityID             int      `json:"city_id"`
	City               *City    `gorm:"not null;column:city_id;foreignKey:CityID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	StateID            int      `json:"state_id"`
	State              *State   `gorm:"not null;column:state_id;foreignKey:StateID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	ZipCodeID          int      `json:"zip_code_id"`
	ZipCode            *ZipCode `gorm:"not null;column:zip_code_id;foreignKey:ZipCodeID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CountryID          int      `json:"country_id"`
	Country            *Country `gorm:"not null;column:country_id;foreignKey:CountryID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
