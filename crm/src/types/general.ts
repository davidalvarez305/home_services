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

export type CreateLeadInput = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  campaign: string;
  source: string;
  campaign_name: string;
  referral_url: string;
  medium: string;
  keywords: string;
  lead_channel: string;
  zip_code: string;
  service: number;
  street_address_line_1: string;
  street_address_line_2: string;
  street_address_line_3: string;
  city: number;
  state: number;
  country: number;
  budget: number;
}

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

export type LeadDetails = {
  id: number;
  email: string;
  uuid: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  company_id: number;
  street_address_line_1: string;
  street_address_line_2: string;
  street_address_line_3: string;
  city: string;
  city_id: number;
  state: string;
  state_id: number;
  country: string;
  country_id: number;
  zip_code: string;
  created_at: number;
  service: string;
  service_id: number;
  photos: string;
  budget: number;
}
