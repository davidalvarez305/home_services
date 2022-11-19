package models

type QuotePhoto struct {
	ID          int    `json:"id"`
	ImageURL    string `gorm:"unique;not null" json:"image_url"`
	Description string `json:"description"`
	QuoteID     int    `json:"quote_id"`
	Quote       *Quote `gorm:"not null;column:quote_id;foreignKey:QuoteID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
