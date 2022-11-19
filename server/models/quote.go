package models

type Quote struct {
	ID        int        `json:"id"`
	ZipCode   string     `gorm:"column:zip_code" json:"zip_code"`
	Zip       *ZipCode   `gorm:"not null;column:zip_code;foreignKey:ZipCode;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt int64      `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt int64      `gorm:"not null;column:updated_at" json:"updated_at"`
	Service   []*Service `gorm:"many2many:quote_services" json:"-"`
	LeadID    int        `gorm:"column:lead_id" json:"lead_id"`
	Lead      *Lead      `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	AddressID int        `gorm:"column:address_id" json:"address_id"`
	Address   *Address   `gorm:"column:address_id;foreignKey:AddressID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
