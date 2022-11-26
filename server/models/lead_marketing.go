package models

type LeadMarketing struct {
	ID           int    `json:"id"`
	LeadID       int    `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"lead_id"`
	Campaign     string `json:"campaign"`
	Source       string `json:"source"`
	Medium       string `json:"medium"`
	CampaignName string `json:"campaign_name"`
	LeadChannel  string `json:"lead_channel"`
	ReferralURL  string `json:"referral_url"`
	Keywords     string `json:"keywords"`
}
