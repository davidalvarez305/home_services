package models

type Quote struct {
	ID            int              `json:"id"`
	ZipCode       string           `gorm:"column:zip_code" json:"zip_code"`
	Zip           *ZipCode         `gorm:"not null;column:zip_code;foreignKey:ZipCode;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt     int64            `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt     int64            `gorm:"not null;column:updated_at" json:"updated_at"`
	LeadID        int              `gorm:"column:lead_id" json:"lead_id"`
	AddressID     int              `json:"address_id"`
	Address       *Address         `gorm:"column:address_id;foreignKey:AddressID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CompanyID     int              `gorm:"column:company_id;constraint:OnDelete:SET NULL,OnUpdate:CASCADE" json:"company_id"`
	Service       []*Service       `gorm:"many2many:quote_services" json:"-"`
	QuotePhoto    []*QuotePhoto    `gorm:"foreignKey:QuoteID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"quote_photo"`
	QuoteServices []*QuoteServices `json:"-"`
}
