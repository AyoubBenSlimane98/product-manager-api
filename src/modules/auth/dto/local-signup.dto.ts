import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LocalSignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsAlpha()
  @MinLength(4)
  @IsNotEmpty()
  first_name: string;

  @IsAlpha()
  @MinLength(4)
  @IsNotEmpty()
  last_name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
