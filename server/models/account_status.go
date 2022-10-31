package models

type AccountStatus struct {
	ID     int    `json:"id"`
	Status string `json:"status"` // pending approval, suspended, active, late
}
