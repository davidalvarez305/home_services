package models

type LeadPhoto struct {
	ID       int    `json:"id"`
	ImageURL string `gorm:"unique;not null" json:"image_url"`
	LeadID   int    `json:"lead_id"`
}
