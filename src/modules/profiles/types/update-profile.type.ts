import { BaseMessageProfile } from './get-profile.type';

export type UpdateProfileResponse = BaseMessageProfile & {
  profile_id: string;
};
