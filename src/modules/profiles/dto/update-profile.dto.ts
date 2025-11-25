import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProfile } from './create-profile.dto';

export class UpdateProfile extends OmitType(PartialType(CreateProfile), [
  'user_id',
] as const) {}
