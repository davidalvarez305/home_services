package models

type InvoiceLeads struct {
	ID        int      `json:"id"`
	InvoiceID int      `gorm:"column:invoice_id" json:"invoice_id"`
	Invoice   *Invoice `gorm:"not null;column:invoice_id;foreignKey:InvoiceID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	LeadID    int      `gorm:"column:lead_id" json:"lead_id"`
	Lead      *Lead    `gorm:"not null;column:lead_id;foreignKey:LeadID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
