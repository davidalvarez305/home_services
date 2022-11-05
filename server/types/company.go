package types

type CreateCompanyInput struct {
	Name               string `json:"name"`
	Logo               string `json:"logo"`
	StreetAddressLine1 string `json:"street_address_line_1"`
	StreetAddressLine2 string `json:"street_address_line_2"`
	StreetAddressLine3 string `json:"street_address_line_3"`
	City               int    `json:"city"`
	State              int    `json:"state"`
	ZipCode            int    `json:"zip_code"`
}
