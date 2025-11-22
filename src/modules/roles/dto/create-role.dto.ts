import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @Matches(/^[A-Z-]+$/, {
    message: 'name contain only upper case letters, with hyphens',
  })
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;
}
