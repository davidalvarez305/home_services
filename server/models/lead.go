package models

type Lead struct {
	ID            int    `json:"id"`
	Email         string `gorm:"unique;not null" json:"email"`
	UUID          string `gorm:"unique;not null" json:"uuid"`
	FirstName     string `gorm:"unique;not null" json:"first_name"`
	LastName      string `gorm:"unique;not null" json:"last_name"`
	PhoneNumber   string `gorm:"column:phone_number" json:"phone_number"`
	CreatedAt     int64  `gorm:"column:created_at" json:"created_at"`
	CompanyID     int    `gorm:"column:company_id;constraint:OnDelete:SET NULL,OnUpdate:CASCADE" json:"company_id"`
	LeadMarketing *LeadMarketing
	Quote         []*Quote
	Log           []*LeadLog
}
