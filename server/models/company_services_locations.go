package models

type CompanyServicesLocations struct {
	ID        int      `json:"id"`
	ServiceID int      `json:"service_id"`
	Service   *Service `gorm:"uniqueIndex:compositeindex;not null;column:service_id;foreignKey:ServiceID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CompanyID int      `json:"company_id"`
	Company   *Company `gorm:"uniqueIndex:compositeindex;not null;column:company_id;foreignKey:CompanyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	ZipCodeID int      `json:"zip_code_id"`
	ZipCode   *ZipCode `gorm:"uniqueIndex:compositeindex;not null;column:zip_code_id;foreignKey:ZipCodeID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
