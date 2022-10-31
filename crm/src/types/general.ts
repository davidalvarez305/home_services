export type CreditCard = {};

export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  profile_image: string;
  created_at: string;
  credit_cards?: CreditCard[];
};
