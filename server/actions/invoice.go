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
	return database.DB.Where("id = ?", id).First(&i).Error
}

func (i *Invoices) GetInvoiceDetails(companyId string) error {
	return database.DB.Where("company_id = ?", companyId).Preload("Lead").Find(&i).Error
}
