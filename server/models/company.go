package models

type Company struct {
	ID            int              `json:"id"`
	Username      string           `gorm:"unique;not null" json:"username"`
	Password      string           `gorm:"not null" json:"password"`
	Email         string           `gorm:"unique;not null" json:"email"`
	APIToken      string           `gorm:"column:api_token;unique;not null" json:"api_token"`
	ProfileImage  string           `gorm:"column:profile_picture" json:"profile_picture"`
	CreatedAt     int64            `gorm:"column:created_at" json:"created_at"`
	UpdatedAt     int64            `gorm:"column:updated_at" json:"updated_at"`
	AccountStatus []*AccountStatus `gorm:"many2many:company_account_status" json:"-"`
	Invoice       []*Invoice       `gorm:"many2many:company_invoices" json:"-"`
	Service       []*Service       `gorm:"many2many:company_services_locations" json:"-"`
	ZipCode       []*ZipCode       `gorm:"many2many:company_services_locations" json:"-"`
	User          []*User          `gorm:"many2many:user_company_role" json:"-"`
	Role          []*Role          `gorm:"many2many:user_company_role" json:"-"`
}
