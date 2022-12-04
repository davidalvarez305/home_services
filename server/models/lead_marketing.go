package models

type LeadMarketing struct {
	ID           int    `json:"id"`
	LeadID       int    `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"lead_id"`
	Source       string `json:"source"`
	Medium       string `json:"medium"`
	LeadChannel  string `json:"lead_channel"`
	LandingPage  string `json:"landing_page"`
	Keyword      string `json:"keyword"`
	Referrer     string `json:"referrer"`
	GClid        string `json:"gclid"`
	CampaignID   string `json:"campaign_id"`
	CampaignName string `json:"campaign_name"`
	AdGroupID    string `json:"ad_group_id"`
	AdGroupName  string `json:"ad_group_name"`
	AdSetID      string `json:"ad_set_id"`
	AdSetName    string `json:"ad_set_name"`
	AdID         string `json:"ad_id"`
	AdHeadline   string `json:"ad_headline"`
}
