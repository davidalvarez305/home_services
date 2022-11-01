package models

type LeadQuotes struct {
	ID      int    `json:"id"`
	LeadID  int    `gorm:"column:lead_id" json:"lead_id"`
	Lead    *Lead  `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	QuoteID int    `gorm:"column:quote_id" json:"quote_id"`
	Quote   *Quote `gorm:"not null;column:quote_id;foreignKey:QuoteID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
