package models

type CompanyInvoices struct {
	ID        int      `json:"id"`
	InvoiceID int      `json:"invoice_id"`
	Invoice   *Invoice `gorm:"not null;column:invoice_id;foreignKey:InvoiceID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	CompanyID int      `json:"company_id"`
	Company   *Company `gorm:"not null;column:company_id;foreignKey:CompanyID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
