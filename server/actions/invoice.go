package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

func SaveInvoice(invoice models.Invoice) error {
	return database.DB.Save(&invoice).Association("InvoiceLeads").Error
}

func GetInvoiceByID(id string) (models.Invoice, error) {
	var invoice models.Invoice
	err := database.DB.Where("id = ?", id).Preload("Lead").First(&invoice).Error
	return invoice, err
}

func GetCompanyInvoices(companyId string) ([]models.Invoice, error) {
	var invoices []models.Invoice
	err := database.DB.Where("company_id = ?", companyId).Preload("Lead.Address").Preload("Lead.Service").Preload("Company.Address.City").Preload("Company.Address.State").Preload("Company.Address.Country").Preload("PaymentStatus").Find(&invoices).Error
	return invoices, err
}

func GetInvoiceByInvoiceID(invoice_id string) (models.Invoice, error) {
	var invoice models.Invoice
	err := database.DB.Where("invoice_id = ?", invoice_id).First(&invoice).Error
	return invoice, err
}
