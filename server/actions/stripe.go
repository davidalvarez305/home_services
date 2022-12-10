package actions

import (
	"fmt"
	"os"
	"time"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/models"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/customer"
	"github.com/stripe/stripe-go/v74/invoice"
	"github.com/stripe/stripe-go/v74/invoiceitem"
)

type LeadCount struct {
	Count int `json:"count"`
}

func (lc *LeadCount) GetLeadCount() error {
	sql := `
	SELECT COUNT(*) FROM lead
	WHERE company_id  = 1
	AND created_at > 1670224630
	AND created_at < 1670400180;
	`

	return database.DB.Raw(sql).Scan(&lc).Error
}

func (company *Company) CreateStripeCustomer(owner *User) error {

	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	params := &stripe.CustomerParams{
		Name:             stripe.String(company.Name),
		Description:      stripe.String("Stripe Developer"),
		Email:            stripe.String(owner.Email),
		PreferredLocales: stripe.StringSlice([]string{"en"}),
		Phone:            stripe.String(owner.PhoneNumber),
	}

	c, err := customer.New(params)

	if err != nil {
		return err
	}

	company.StripeCustomerID = c.ID

	return company.Save()
}

func CreateInvoice(company *Company) (*Invoice, error) {
	inv := &Invoice{}
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	customFields := []*stripe.InvoiceCustomFieldParams{}

	customFields = append(customFields, &stripe.InvoiceCustomFieldParams{
		Name:  stripe.String("Number of Leads Delivered"),
		Value: stripe.String("99"),
	})

	thirtydaysFromNow := time.Now().Unix() + 2592000
	_, month, _ := time.Now().Date()

	params := &stripe.InvoiceParams{
		Customer:         stripe.String(company.StripeCustomerID),
		AutoAdvance:      stripe.Bool(true),
		CollectionMethod: stripe.String(string(stripe.InvoiceCollectionMethodSendInvoice)),
		Currency:         stripe.String(string(stripe.CurrencyUSD)),
		DaysUntilDue:     stripe.Int64(30),
		CustomFields:     customFields,
		Description:      stripe.String(fmt.Sprintf("Invoice for leads generated in the month of %s.", month.String())),
	}

	in, err := invoice.New(params)

	if err != nil {
		return inv, err
	}

	// Get Invoice Leads
	lc := LeadCount{}
	err = lc.GetLeadCount()

	if err != nil {
		return inv, err
	}

	amountDue := lc.Count * company.PriceAgreement * 100

	item := &stripe.InvoiceItemParams{
		Customer: stripe.String(company.StripeCustomerID),
		Amount:   stripe.Int64(int64(amountDue)),
		Invoice:  stripe.String(in.ID),
		Currency: stripe.String("usd"),
	}

	_, err = invoiceitem.New(item)

	if err != nil {
		return inv, err
	}

	i := models.Invoice{
		InvoiceID:              in.ID,
		InvoiceAmount:          int(in.AmountDue),
		InvoiceDueDate:         thirtydaysFromNow,
		InvoicePaymentStatusID: 1, // 1 is pending
		CompanyID:              company.ID,
	}

	_, err = invoice.SendInvoice(in.ID, nil)

	if err != nil {
		return inv, err
	}

	inv.Invoice = &i

	err = inv.Save()

	if err != nil {
		return inv, err
	}

	return inv, err
}
