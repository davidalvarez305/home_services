package models

type QuotePhoto struct {
	ID       int    `json:"id"`
	ImageURL string `gorm:"unique;not null" json:"image_url"`
	QuoteID  int    `json:"quote_id"`
}
