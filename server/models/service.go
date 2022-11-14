package models

type Service struct {
	ID      int    `json:"id"`
	Service string `gorm:"unique;not null" json:"service"`
}
