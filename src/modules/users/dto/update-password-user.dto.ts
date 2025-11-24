import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
