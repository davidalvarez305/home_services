package models

type LeadPhoto struct {
	ID          int    `json:"id"`
	ImageURL    string `gorm:"unique;not null" json:"image_url"`
	Description string `json:"description"`
	LeadID      int    `json:"lead_id"`
	Lead        *Lead  `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
