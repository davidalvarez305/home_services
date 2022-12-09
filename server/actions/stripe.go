package actions

import (
	"fmt"
	"os"
	"time"

	"github.com/davidalvarez305/home_services/server/models"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/customer"
	"github.com/stripe/stripe-go/v74/invoice"
)

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

func CreateInvoice(company *Company) error {
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
		CollectionMethod: stripe.String("send_invoice"),
		Currency:         stripe.String("USD"),
		DaysUntilDue:     stripe.Int64(30),
		CustomFields:     customFields,
		Description:      stripe.String(fmt.Sprintf("Invoice for leads generated in the month of %s.", month.String())),
		DueDate:          stripe.Int64(thirtydaysFromNow),
	}

	in, err := invoice.New(params)

	if err != nil {
		return err
	}

	invoice := &Invoice{}

	i := models.Invoice{
		InvoiceID:              in.ID,
		InvoiceAmount:          int(in.AmountDue),
		InvoiceDueDate:         thirtydaysFromNow,
		InvoicePaymentStatusID: 1, // 1 is pending
		CompanyID:              company.ID,
	}

	invoice.Invoice = &i

	err = invoice.Save()

	return err
}
