package models

type Address struct {
	ID                 int      `json:"id"`
	StreetAddressLine1 string   `gorm:"column:street_address_line1" json:"street_address_line_1"`
	StreetAddressLine2 string   `gorm:"column:street_address_line2" json:"street_address_line_2"`
	StreetAddressLine3 string   `gorm:"column:street_address_line3" json:"street_address_line_3"`
	CityID             int      `json:"city_id"`
	City               *City    `gorm:"not null;column:city_id;foreignKey:CityID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"city"`
	StateID            int      `json:"state_id"`
	State              *State   `gorm:"not null;column:state_id;foreignKey:StateID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"state"`
	ZipCode            string   `json:"zip_code"`
	Zip                *ZipCode `gorm:"not null;column:zip_code;foreignKey:ZipCode;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CountryID          int      `json:"country_id"`
	Country            *Country `gorm:"not null;column:country_id;foreignKey:CountryID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"country"`
}
