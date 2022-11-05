package models

type Quote struct {
	ID        int        `json:"id"`
	ZipCodeID int        `gorm:"column:zip_code_id" json:"zip_code_id"`
	ZipCode   *ZipCode   `gorm:"not null;column:zip_code_id;foreignKey:ZipCodeID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt int64      `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt int64      `gorm:"not null;column:updated_at" json:"updated_at"`
	Service   []*Service `gorm:"many2many:quote_services" json:"-"`
}
