package models

type CompanyUserRole struct {
	ID        int      `json:"id"`
	UserID    int      `json:"user_id"`
	User      *Users   `gorm:"not null;column:user_id;foreignKey:UserID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CompanyID int      `json:"company_id"`
	Company   *Company `gorm:"not null;column:company_id;foreignKey:CompanyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	RoleID    int      `json:"role_id"`
	Role      *Role    `gorm:"not null;column:role_id;foreignKey:RoleID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
