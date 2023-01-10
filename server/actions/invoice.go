package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Invoice struct {
	*models.Invoice
}

type Invoices []*models.Invoice

func (i *Invoice) Save() error {
	return database.DB.Save(&i).Association("InvoiceLeads").Error
}

func (i *Invoice) GetInvoiceByID(id string) error {
	return database.DB.Where("id = ?", id).Preload("Lead").First(&i).Error
}

func (i *Invoices) GetCompanyInvoices(companyId string) error {
	err := database.DB.Where("company_id = ?", companyId).Preload("Lead.Address").Preload("Lead.Service").Preload("Company.Address.City").Preload("Company.Address.State").Preload("Company.Address.Country").Preload("PaymentStatus").Find(&i).Error
	return err
}

func (i *Invoice) GetInvoiceByInvoiceID(invoice_id string) error {
	return database.DB.Where("invoice_id = ?", invoice_id).First(&i).Error
}
