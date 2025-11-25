import { BaseMessageResponse } from './getUser-phone.type';
export type PhoneResponse = {
  phone_id: string;
  country_code: string;
  phone_number: string;
};
export type CreatePhonesResponse = BaseMessageResponse & {
  phones: PhoneResponse[];
};
