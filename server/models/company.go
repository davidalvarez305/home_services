package models

type Company struct {
	ID               int            `json:"id"`
	Name             string         `gorm:"unique;not null;column:name" json:"name"`
	Logo             string         `gorm:"column:logo" json:"logo"`
	StripeCustomerID string         `gorm:"column:stripe_customer_id" json:"stripe_customer_id"`
	CreatedAt        int64          `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt        int64          `gorm:"not null;column:updated_at" json:"updated_at"`
	AccountStatusID  int            `json:"account_status_id"`
	AccountStatus    *AccountStatus `gorm:"not null;column:account_status_id;foreignKey:AccountStatusID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	Invoice          []*Invoice     `gorm:"many2many:company_invoices" json:"-"`
	Service          []*Service     `gorm:"many2many:company_services_locations" json:"-"`
	ZipCode          []*ZipCode     `gorm:"many2many:company_services_locations" json:"-"`
	User             []*User        `gorm:"many2many:user_company_role" json:"-"`
	AddressID        int            `json:"address_id"`
	Address          *Address       `gorm:"not null;column:address_id;foreignKey:AddressID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
