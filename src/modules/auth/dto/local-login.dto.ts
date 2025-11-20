import { OmitType } from '@nestjs/mapped-types';
import { LocalSignupDto } from './local-signup.dto';

export class LocalLoginDto extends OmitType(LocalSignupDto, [
  'username',
] as const) {}
