package models

type Role struct {
	ID   int    `json:"id"`
	Name string `gorm:"unique;not null" json:"name"`
}
