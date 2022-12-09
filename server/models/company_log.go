package models

type CompanyLog struct {
	ID        int    `json:"id"`
	Action    string `gorm:"not null" json:"action"`
	CreatedAt int64  `gorm:"not null;column:created_at" json:"created_at"`
	CompanyID int    `gorm:"foreignKey:CompanyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"company_id"`
}
