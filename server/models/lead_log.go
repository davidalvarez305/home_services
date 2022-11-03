package models

type LeadLog struct {
	ID        int    `json:"id"`
	Action    string `gorm:"unique;not null" json:"action"`
	CreatedAt int64  `gorm:"not null;column:created_at" json:"created_at"`
	LeadID    int    `gorm:"column:lead_id" json:"lead_id"`
	Lead      *Lead  `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
