package models

type Lead struct {
	ID          int      `json:"id"`
	Email       string   `gorm:"unique;not null" json:"email"`
	PhoneNumber string   `gorm:"not null;column:phone_number" json:"phone_number"`
	CreatedAt   int64    `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt   int64    `gorm:"not null;column:updated_at" json:"updated_at"`
	Quote       []*Quote `gorm:"many2many:lead_quotes" json:"-"`
}
