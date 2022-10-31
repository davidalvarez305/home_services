package models

type City struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	StateID int    `json:"state_id"`
	State   *State `gorm:"not null;column:state_id;foreignKey:StateID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
