package models

type CityZipCode struct {
	ID        int      `json:"id"`
	CityID    int      `json:"city_id"`
	City      *City    `gorm:"not null;column:city_id;foreignKey:CityID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	ZipCodeID int      `json:"zip_code_id"`
	ZipCode   *ZipCode `gorm:"not null;column:zip_code_id;foreignKey:ZipCodeID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	DMAID     int      `json:"dma_id"`
	DMA       *DMA     `gorm:"not null;column:dma_id;foreignKey:DMAID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
