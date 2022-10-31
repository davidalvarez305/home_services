package models

type AccountStatus struct {
	ID        int    `json:"id"`
	UserID    int    `json:"user_id"`
	User      *Users `gorm:"not null;column:user_id;foreignKey:UserID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CreatedAt int64  `gorm:"not null;column:created_at" json:"createdAt"`
}
