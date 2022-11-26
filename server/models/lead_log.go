package models

type LeadLog struct {
	ID        int    `json:"id"`
	Action    string `gorm:"not null" json:"action"`
	CreatedAt int64  `gorm:"not null;column:created_at" json:"created_at"`
	LeadID    int    `gorm:"foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"lead_id"`
}
