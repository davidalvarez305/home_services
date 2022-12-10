package models

type Invoice struct {
	ID                     int            `json:"id"`
	InvoiceID              string         `gorm:"not null;column:invoice_id" json:"invoice_id"`
	InvoiceAmount          int            `gorm:"not null;column:invoice_amount" json:"invoice_amount"`
	InvoiceDueDate         int64          `gorm:"not null;column:invoice_due_date" json:"invoice_due_date"`
	InvoicePaymentStatusID int            `json:"invoice_payment_status_id"`
	PaymentStatus          *PaymentStatus `gorm:"not null;column:invoice_payment_status_id;foreignKey:InvoicePaymentStatusID;CASCADE,OnUpdate:CASCADE" json:"-"`
	CompanyID              int            `json:"company_id"`
	Company                *Company       `gorm:"not null;column:company_id;foreignKey:CompanyID;constraint:OnUpdate:CASCADE" json:"-"`
	Lead                   []*Lead        `json:"leads"`
}
