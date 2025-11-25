import { Phone } from 'src/modules/phones/types';

export type BaseMessageProfile = {
  message: string;
};
export type GetProfileResponse = BaseMessageProfile & {
  profile_id: string;
  phones: Phone[];
};
