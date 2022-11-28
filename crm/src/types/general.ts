export type CreditCard = {};

export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  profile_picture: string;
  created_at: number;
  updated_at: number;
  api_token: string;
  account_status_id: number;
  company_id: number;
  role_id: number;
};

export type Lead = {
  id: number;
  email: string;
  uuid: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  created_at: number;
  company_id: number;
  lead_marketing?: Object;
  quote?: [];
  lead_log?: [];
};

export type Company = {
  id: number;
  name: string;
  logo: string;
  stripe_customer_id: string;
  created_at: number;
  updated_at: number;
  account_status_id: number;
  address_id: number;
};

export type AccountStatus = {
  id: number;
  status: string;
};

export type Role = {
  id: number;
  role: string;
};

export type CreateCompanyInput = {
  name: string;
  logo: string;
  street_address_line_1: string;
  street_address_line_2: string;
  street_address_line_3: string;
  city: number;
  state: number;
  zip_code: number;
};

// Do I use this anywhere?
export type CSL = {
  name: string;
  logo: string;
  street_address_line_1: string;
  street_address_line_2: string;
  street_address_line_3: string;
  city: number;
  state: number;
  zip_codes: number[];
  services: number[];
};

export type CompanyServicesByArea = {
  id: number;
  service_id: number;
  service: string;
  zip_code: string;
  city_id: number;
  city: string;
};

export type Service = {
  id: number;
  service: string;
};

export type ZipCode = {
  zip_codes: string;
  city_id: number;
  city: string;
  county_id: number;
  county: string;
  state_id: number;
  state: string;
  country_id: number;
  country: string;
};

export type Location = {
  zip_codes: string;
  city_id: number;
  city: string;
  county_id: number;
  county: string;
  state_id: number;
  state: string;
  country_id: number;
  country: string;
};

export type State = {
  id: number;
  state: string;
};

export type City = {
  id: number;
  city: string;
};

export type CompanyServiceLocations = {
  id?: number;
  service_id: number;
  company_id: number;
  zip_code: string;
};

export type CreateQuoteInput = {
  zip_code: string;
  services: number[];
  street_address_line_1: string;
  street_address_line_2: string;
  street_address_line_3: string;
  city_id: number;
  state_id: number;
  country_id: number;
}

export type Quote = {
  id: number;
  zip_code: string;
  created_at: number;
  updated_at: number;
  lead_id: number;
  address_id: number;
}