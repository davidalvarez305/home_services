package types

type CreateCompanyInput struct {
	Name               string   `json:"name"`
	Logo               string   `json:"logo"`
	StreetAddressLine1 string   `json:"street_address_line_1"`
	StreetAddressLine2 string   `json:"street_address_line_2"`
	StreetAddressLine3 string   `json:"street_address_line_3"`
	Services           []string `json:"services"`
	Locations          []string `json:"locations"`
}
