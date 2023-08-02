package actions

import (
	"fmt"
	"os"
	"time"

	"github.com/davidalvarez305/home_services/server/models"
	"github.com/jinzhu/now"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/customer"
	"github.com/stripe/stripe-go/v74/invoice"
	"github.com/stripe/stripe-go/v74/invoiceitem"
)

func (company *Company) CreateStripeCustomer(owner models.User) error {

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

	return nil
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
	leads := &Leads{}

	begin := now.BeginningOfMonth().Unix()
	end := now.EndOfMonth().Unix()

	err = leads.GetLeadsByDates(company.ID, begin, end)

	if err != nil {
		return inv, err
	}

	amountDue := len(*leads) * company.PriceAgreement * 100

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

	for _, lead := range *leads {
		inv.Lead = append(inv.Lead, lead)
	}

	err = inv.Save()

	if err != nil {
		return inv, err
	}

	return inv, err
}
