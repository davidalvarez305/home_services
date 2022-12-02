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
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Email        string `json:"email"`
	PhoneNumber  string `json:"phone_number"`
	Campaign     string `json:"campaign"`
	Source       string `json:"source"`
	CampaignName string `json:"campaign_name"`
	ReferralURL  string `json:"referral_url"`
	Medium       string `json:"medium"`
	Keywords     string `json:"keywords"`
	LeadChannel  string `json:"lead_channel"`
	ZipCode      string `json:"zip_code"`
	Service      int    `json:"service"`
}

type QuoteInput struct {
	ID                 int    `json:"id"`
	ZipCode            string `json:"zip_code"`
	StreetAddressLine1 string `json:"street_address_line_1"`
	StreetAddressLine2 string `json:"street_address_line_2"`
	StreetAddressLine3 string `json:"street_address_line_3"`
	CityID             int    `json:"city"`
	StateID            int    `json:"state"`
	CountryID          int    `json:"country"`
	Service            int    `json:"service"`
	Budget             int    `json:"budget"`
}

// https://www.twilio.com/docs/messaging/guides/webhook-request
type TwillioWebhookRequestBody struct {
	MessageSid          string `json:"MessageSid"`
	SmsSid              string `json:"SmsSid"`
	AccountSid          string `json:"AccountSid"`
	MessagingServiceSid string `json:"MessagingServiceSid"`
	From                string `json:"From"`
	To                  string `json:"To"`
	Body                string `json:"Body"`
	NumMedia            int    `json:"NumMedia"`
	ReferralNumMedia    string `json:"ReferralNumMedia"`
	MediaContentType0   string `json:"MediaContentType0"`
	MediaUrl0           string `json:"MediaUrl0"`
	MediaContentType1   string `json:"MediaContentType1"`
	MediaUrl1           string `json:"MediaUrl1"`
	MediaContentType2   string `json:"MediaContentType2"`
	MediaUrl2           string `json:"MediaUrl2"`
	MediaContentType3   string `json:"MediaContentType3"`
	MediaUrl3           string `json:"MediaUrl3"`
	MediaContentType4   string `json:"MediaContentType4"`
	MediaUrl4           string `json:"MediaUrl4"`
	MediaContentType5   string `json:"MediaContentType5"`
	MediaUrl5           string `json:"MediaUrl5"`
	MediaContentType6   string `json:"MediaContentType6"`
	MediaUrl6           string `json:"MediaUrl6"`
	MediaContentType7   string `json:"MediaContentType7"`
	MediaUrl7           string `json:"MediaUrl7"`
	MediaContentType8   string `json:"MediaContentType8"`
	MediaUrl8           string `json:"MediaUrl8"`
	MediaContentType9   string `json:"MediaContentType9"`
	MediaUrl9           string `json:"MediaUrl9"`
	MediaContentType10  string `json:"MediaContentType10"`
	MediaUrl10          string `json:"MediaUrl10"`
}
