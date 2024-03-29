package models

type User struct {
	ID              int            `gorm:"primaryKey" json:"id"`
	Username        string         `gorm:"unique;not null" json:"username"`
	Password        string         `gorm:"not null" json:"password"`
	Email           string         `gorm:"unique;not null" json:"email"`
	PhoneNumber     string         `gorm:"unique;not null" json:"phone_number"`
	JobTitle        string         `json:"job_title"`
	FirstName       string         `json:"first_name"`
	LastName        string         `json:"last_name"`
	APIToken        string         `gorm:"column:api_token;unique;not null" json:"api_token"`
	ProfileImage    string         `gorm:"column:profile_picture" json:"profile_picture"`
	CreatedAt       int64          `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt       int64          `gorm:"not null;column:updated_at" json:"updated_at"`
	AccountStatusID int            `json:"account_status_id"`
	AccountStatus   *AccountStatus `gorm:"not null;column:account_status_id;foreignKey:AccountStatusID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	RoleID          int            `json:"role_id"`
	Role            *Role          `gorm:"column:role_id;foreignKey:RoleID;constraint:OnDelete:SET NULL,OnUpdate:CASCADE" json:"-"`
	CompanyID       *int           `json:"company_id"`
	Company         *Company       `gorm:"column:company_id;null:true;foreignKey:CompanyID;constraint:OnDelete:SET NULL,OnUpdate:CASCADE" json:"-"`
}
