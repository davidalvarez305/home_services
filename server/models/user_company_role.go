package models

type UserCompanyRole struct {
	UserID    int      `json:"user_id"`
	User      *User    `gorm:"primaryKey;column:user_id;foreignKey:UserID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CompanyID int      `json:"company_id"`
	Company   *Company `gorm:"primaryKey;column:company_id;foreignKey:CompanyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	RoleID    int      `json:"role_id"`
	Role      *Role    `gorm:"primaryKey;column:role_id;foreignKey:RoleID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt int64    `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt int64    `gorm:"not null;column:updated_at" json:"updated_at"`
}
