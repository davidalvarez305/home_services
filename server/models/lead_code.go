package models

type LeadCode struct {
	ID        int    `json:"-"`
	Code      string `gorm:"unique;not null" json:"uuid"`
	LeadID    int    `json:"lead_id"`
	Lead      *Lead  `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt int64  `gorm:"not null;column:created_at" json:"created_at"`
}
