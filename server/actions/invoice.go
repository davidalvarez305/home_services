package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Invoice struct {
	*models.Invoice
}

type Invoices []*models.Invoice

type CustomInvoiceLead struct {
	CreatedAt int64  `json:"created_at"`
	Budget    int    `json:"budget"`
	ZipCode   string `json:"zip_code"`
	Service   string `json:"service"`
}

type CompanyInvoice struct {
	InvoiceID      string      `json:"invoice_id"`
	InvoiceAmount  int         `json:"invoice_amount"`
	InvoiceDueDate int64       `json:"invoice_due_date"`
	Status         string      `json:"status"`
	Leads          interface{} `json:"leads"`
}

type CompanyInvoices []*CompanyInvoice

func (i *Invoice) Save() error {
	return database.DB.Save(&i).Association("InvoiceLeads").Error
}

func (i *Invoice) GetInvoiceByID(id string) error {
	return database.DB.Where("id = ?", id).Preload("Lead").First(&i).Error
}

func (i *CompanyInvoices) GetCompanyInvoices(companyId string) error {

	sql := `
	SELECT i.invoice_due_date, i.invoice_id , i.invoice_amount, p.status, json_build_object('leads', (
		SELECT jsonb_agg(row_to_json(lead)) AS l FROM lead
		LEFT JOIN address AS a
		ON a.id = lead.address_id
		LEFT JOIN service AS s
		ON s.id = lead.service_id
	)) AS invoice_leads
	FROM invoice AS i
	LEFT JOIN payment_status AS p
	ON i.invoice_payment_status_id = p.id
	WHERE i.company_id = ?;	
	`
	return database.DB.Raw(sql, companyId).Scan(&i).Error
}

func (i *Invoice) GetInvoiceByInvoiceID(invoice_id string) error {
	return database.DB.Where("invoice_id = ?", invoice_id).First(&i).Error
}
