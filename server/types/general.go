package types

type CreateCompanyInput struct {
	Name               string `json:"name"`
	Logo               string `json:"logo"`
	StreetAddressLine1 string `json:"street_address_line_1"`
	StreetAddressLine2 string `json:"street_address_line_2"`
	StreetAddressLine3 string `json:"street_address_line_3"`
	City               int    `json:"city"`
	State              int    `json:"state"`
	ZipCode            string `json:"zip_code"`
}

type UsersByCompany struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	CompanyID int    `json:"company_id"`
	UserID    int    `json:"user_id"`
	RoleID    int    `json:"role_id"`
}

type CreateServicesInput struct {
	CityID    int `json:"city_id"`
	CompanyID int `json:"company_id"`
	ServiceID int `json:"service_id"`
}

type CreateLeadInput struct {
	ID                 int    `json:"id"`
	FirstName          string `json:"first_name"`
	LastName           string `json:"last_name"`
	Email              string `json:"email"`
	PhoneNumber        string `json:"phone_number"`
	Campaign           string `json:"campaign"`
	Source             string `json:"source"`
	CampaignName       string `json:"campaign_name"`
	ReferralURL        string `json:"referral_url"`
	Medium             string `json:"medium"`
	Keywords           string `json:"keywords"`
	LeadChannel        string `json:"lead_channel"`
	ZipCode            string `json:"zip_code"`
	Service            int    `json:"service"`
	StreetAddressLine1 string `json:"street_address_line_1"`
	StreetAddressLine2 string `json:"street_address_line_2"`
	StreetAddressLine3 string `json:"street_address_line_3"`
	CityID             int    `json:"city"`
	StateID            int    `json:"state"`
	CountryID          int    `json:"country"`
	Budget             int    `json:"budget"`
}
