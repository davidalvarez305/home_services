export type CreditCard = {};

export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  profile_picture: string;
  created_at: number;
  api_token: string;
  updated_at: number;
  account_status_id: number;
  company_id?: number;
  role_id?: number;
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

export type UsersByCompany = {
  username: string;
  email: string;
  company_id: number;
  user_id: number;
  role_id: number;
};
