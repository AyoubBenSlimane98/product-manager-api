import {
  IsAlpha,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateProfile {
  @IsUUID()
  user_id: string;

  @IsAlpha()
  @MinLength(4)
  @IsNotEmpty()
  first_name: string;

  @IsAlpha()
  @MinLength(4)
  @IsNotEmpty()
  last_name: string;

  @IsUrl()
  @IsOptional()
  avatar_url?: string;
}
