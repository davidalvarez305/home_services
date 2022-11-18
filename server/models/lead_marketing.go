package models

type LeadMarketing struct {
	ID           int    `json:"id"`
	Campaign     string `gorm:"unique;not null" json:"campaign"`
	Source       string `json:"source"`
	Medium       string `json:"medium"`
	CampaignName string `json:"campaign_name"`
	LeadChannel  string `json:"lead_channel"`
	ReferralURL  string `json:"referral_url"`
	Keywords     string `json:"keywords"`
}
