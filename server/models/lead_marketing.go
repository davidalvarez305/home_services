package models

type LeadMarketing struct {
	ID           int    `json:"id"`
	Campaign     string `gorm:"unique;not null" json:"campaign"`
	Source       string `json:"source"`
	CampaignName string `json:"campaign_name"`
	ReferralURL  string `json:"referral_url"`
	Keywords     string `json:"keywords"`
}
