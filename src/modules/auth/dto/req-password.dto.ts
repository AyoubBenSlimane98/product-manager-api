import { OmitType } from '@nestjs/mapped-types';
import { LocalLoginDto } from './local-login.dto';

export class ReqPasswordDto extends OmitType(LocalLoginDto, [
  'password',
] as const) {}
