package models

type Lead struct {
	ID              int            `json:"id"`
	Email           string         `gorm:"unique;not null" json:"email"`
	FirstName       string         `gorm:"unique;not null" json:"first_name"`
	LastName        string         `gorm:"unique;not null" json:"last_name"`
	PhoneNumber     string         `gorm:"not null;column:phone_number" json:"phone_number"`
	LeadMarketingID int            `gorm:"primaryKey;column:lead_marketing_id" json:"lead_marketing_id"`
	LeadMarketing   *LeadMarketing `gorm:"not null;column:lead_marketing_id;foreignKey:MarketingID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt       int64          `gorm:"not null;column:created_at" json:"created_at"`
}
