import { PhoneResponse } from './create-phones.type';
import { BaseMessageResponse } from './getUser-phone.type';

export type UpdatePhoneResponse = BaseMessageResponse & {
  phone: PhoneResponse;
};
