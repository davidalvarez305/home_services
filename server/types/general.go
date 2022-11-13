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

type UpdateCompanyUserInput struct {
	Users []struct {
		UserID          int
		RoleID          int
		AccountStatusID int
	}
}
