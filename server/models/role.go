package models

type Role struct {
	ID   int    `json:"id"`
	Role string `gorm:"unique;not null" json:"role"`
}
