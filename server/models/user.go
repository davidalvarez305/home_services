package models

import "gorm.io/gorm"

type Users struct {
	gorm.Model
	ID           uint   `json:"id"`
	Username     string `gorm:"unique;not null" json:"username"`
	Password     string `gorm:"not null" json:"password"`
	Email        string `gorm:"unique;not null" json:"email"`
	APIToken     string `gorm:"column:api_token;unique;not null" json:"api_token"`
	ProfileImage string `gorm:"column:profile_picture" json:"profile_picture"`
}
