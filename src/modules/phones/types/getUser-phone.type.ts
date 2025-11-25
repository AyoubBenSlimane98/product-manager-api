export type Phone = {
  phone_id: string;
  profile_id: string;
  country_code: string;
  phone_number: string;
  type: 'mobile' | 'home' | 'work' | null;
  is_primary: boolean | null;
  created_at: Date | null;
  update_at: Date | null;
};
export type BaseMessageResponse = {
  message: string;
};
export type GetUserPhonesResponse = BaseMessageResponse & {
  phones: Phone[];
};
