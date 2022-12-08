package actions

import (
	"os"

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

func CreateInvoice() error {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	customFields := []*stripe.InvoiceCustomFieldParams{}

	customFields = append(customFields, &stripe.InvoiceCustomFieldParams{
		Name:  stripe.String("Number of Leads Delivered"),
		Value: stripe.String("99"),
	})

	params := &stripe.InvoiceParams{
		Customer:             stripe.String(COMPANY_ID),
		AutoAdvance:          stripe.Bool(true),
		CollectionMethod:     stripe.String("send_invoice"),
		Currency:             stripe.String("USD"),
		DaysUntilDue:         stripe.Int64(30),
		CustomFields:         customFields,
		DefaultPaymentMethod: stripe.String(),
		Description:          stripe.String(),
		DueDate:              stripe.String(),
		OnBehalfOf:           stripe.String(),
	}

	in, err := invoice.New(params)

	if err != nil {
		return err
	}

	in.AmountDue
}
