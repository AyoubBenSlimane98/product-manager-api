import { OmitType } from '@nestjs/mapped-types';
import { LocalLoginDto } from './local-login.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPasswordDto extends OmitType(LocalLoginDto, [
  'email',
] as const) {
  @IsNotEmpty()
  @IsString()
  token: string;
}
