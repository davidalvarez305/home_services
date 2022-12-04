package models

type Lead struct {
	ID            int            `json:"id"`
	Email         string         `gorm:"unique;not null" json:"email"`
	UUID          string         `gorm:"unique;not null" json:"uuid"`
	FirstName     string         `gorm:"unique;not null" json:"first_name"`
	LastName      string         `gorm:"unique;not null" json:"last_name"`
	PhoneNumber   string         `gorm:"not null;column:phone_number" json:"phone_number"`
	CreatedAt     int64          `gorm:"not null;column:created_at" json:"created_at"`
	CompanyID     int            `gorm:"column:company_id;constraint:OnDelete:SET NULL,OnUpdate:CASCADE" json:"company_id"`
	Budget        int            `gorm:"column:budget" json:"budget"`
	AddressID     int            `json:"address_id"`
	Address       *Address       `gorm:"column:address_id;foreignKey:AddressID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	ServiceID     int            `gorm:"column:service_id" json:"service_id"`
	Service       *Service       `gorm:"not null;column:service_id;foreignKey:ServiceID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	LeadPhoto     []*LeadPhoto   `gorm:"foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	LeadMarketing *LeadMarketing `json:"-"`
	Log           []*LeadLog     `json:"-"`
}
