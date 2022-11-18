package models

type LeadMarketing struct {
	LeadID       int    `gorm:"primaryKey;column:lead_id" json:"lead_id"`
	Lead         *Lead  `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	Campaign     string `gorm:"unique;not null" json:"campaign"`
	Source       string `json:"source"`
	Medium       string `json:"medium"`
	CampaignName string `json:"campaign_name"`
	LeadChannel  string `json:"lead_channel"`
	ReferralURL  string `json:"referral_url"`
	Keywords     string `json:"keywords"`
}
