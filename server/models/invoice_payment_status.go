package models

type PaymentStatus struct {
	ID     int    `json:"id"`
	Status string `json:"status"` // sent, late, received
}
