package models

type CompanyAccountStatus struct {
	ID              int            `json:"id"`
	CompanyID       int            `json:"company_id"`
	Company         *Company       `gorm:"unique;not null;column:company_id;foreignKey:CompanyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	AccountStatusID int            `json:"account_status_id"`
	AccountStatus   *AccountStatus `gorm:"not null;column:account_status_id;foreignKey:AccountStatusID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt       int64          `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt       int64          `gorm:"not null;column:updated_at" json:"updated_at"`
}
