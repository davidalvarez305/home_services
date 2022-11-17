package models

type Lead struct {
	ID          int    `json:"id"`
	Email       string `gorm:"unique;not null" json:"email"`
	FirstName   string `gorm:"unique;not null" json:"first_name"`
	LastName    string `gorm:"unique;not null" json:"last_name"`
	PhoneNumber string `gorm:"not null;column:phone_number" json:"phone_number"`
}
