package models

type ZipCode struct {
	ID      int    `json:"id"`
	ZipCode string `json:"zip_code"`
	CityID  int    `json:"city_id"`
	City    *City  `gorm:"not null;column:city_id;foreignKey:CityID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
