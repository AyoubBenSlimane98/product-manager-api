import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class CreatePhoneDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,4}$/, {
    message: 'country code should start with + and contain digits only ',
  })
  country_code: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6,15}$/, {
    message: 'phone_number must contain only digits (6–15 length)',
  })
  phone_number: string;

  @IsNotEmpty()
  @IsIn(['mobile', 'home', 'work'])
  type: 'mobile' | 'home' | 'work';

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
}
export class CreatePhonesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhoneDto)
  phones: CreatePhoneDto[];
}
