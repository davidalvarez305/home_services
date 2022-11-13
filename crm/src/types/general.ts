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
  company_id: number | null;
  role_id: number | null;
};

export type AccountStatus = {
  id: number;
  status: string;
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

export type CompanyServiceLocations = {
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
