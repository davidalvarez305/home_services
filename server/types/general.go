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

type CreateLeadInput struct {
	ID                 int    `json:"id"`
	FirstName          string `json:"first_name"`
	LastName           string `json:"last_name"`
	Email              string `json:"email"`
	PhoneNumber        string `json:"phone_number"`
	LandingPage        string `json:"landing_page"`
	Medium             string `json:"medium"`
	Keyword            string `json:"keyword"`
	LeadChannel        string `json:"lead_channel"`
	Source             string `json:"source"`
	Referrer           string `json:"referrer"`
	GClid              string `json:"gclid"`
	CampaignID         string `json:"campaign_id"`
	CampaignName       string `json:"campaign_name"`
	AdGroupID          string `json:"ad_group_id"`
	AdGroupName        string `json:"ad_group_name"`
	AdSetID            string `json:"ad_set_id"`
	AdSetName          string `json:"ad_set_name"`
	AdID               string `json:"ad_id"`
	AdHeadline         string `json:"ad_headline"`
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
