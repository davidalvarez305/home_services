package models

type InvoiceLeads struct {
	ID        int `json:"id"`
	InvoiceID int `gorm:"column:invoice_id" json:"invoice_id"`
	LeadID    int `gorm:"column:lead_id" json:"lead_id"`
}
