package models

type Invoice struct {
	ID                   int            `json:"id"`
	InvoiceAmount        int            `gorm:"not null;column:invoice_amount" json:"invoice_amount"`
	InvoiceDueDate       int64          `gorm:"not null;column:invoice_due_date" json:"invoice_due_date"`
	InvoicePaymentStatus int            `json:"invoice_payment_status"`
	PaymentStatus        *PaymentStatus `gorm:"not null;column:invoice_payment_status;foreignKey:InvoicePaymentStatus;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	Lead                 []*Lead        `gorm:"many2many:invoice_leads" json:"-"`
}
