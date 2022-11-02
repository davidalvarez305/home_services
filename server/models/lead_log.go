package models

type LeadLog struct {
	ID        int    `json:"id"`
	Action    string `gorm:"unique;not null" json:"action"`
	CreatedAt int64  `gorm:"not null;column:created_at" json:"created_at"`
}
