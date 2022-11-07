package models

type CompanyToken struct {
	ID        int      `json:"-"`
	UUID      string   `gorm:"unique;not null" json:"uuid"`
	Email     string   `gorm:"not null" json:"email"`
	CompanyID int      `json:"company_id"`
	Company   *Company `gorm:"not null;column:company_id;foreignKey:CompanyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt int64    `gorm:"not null;column:created_at" json:"created_at"`
}
