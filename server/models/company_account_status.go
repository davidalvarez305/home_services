package models

type CompanyAccountStatus struct {
	CompanyID       int            `json:"company_id"`
	Company         *Company       `gorm:"primaryKey;column:company_id" json:"-"`
	AccountStatusID int            `json:"account_status_id"`
	AccountStatus   *AccountStatus `gorm:"primaryKey;column:account_status_id" json:"-"`
	CreatedAt       int64          `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt       int64          `gorm:"not null;column:updated_at" json:"updated_at"`
}
