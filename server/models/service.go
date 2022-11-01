package models

type Service struct {
	ID   int    `json:"id"`
	Name string `gorm:"unique;not null" json:"name"`
}
