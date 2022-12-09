package actions

import (
	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
)

type Invoice struct {
	*models.Invoice
}

func (i *Invoice) Save() error {
	return database.DB.Save(&i).First(&i).Error
}

func (i *Invoice) GetInvoiceByID(id string) error {
	return database.DB.Where("id = ?", id).First(&i).Error
}
