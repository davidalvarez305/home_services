package models

type AccountStatus struct {
	ID     int     `json:"id"`
	Status string  `json:"status"` // pending approval, suspended, active, late, inactive
	User   []*User `gorm:"many2many:user_account_status" json:"-"`
}
