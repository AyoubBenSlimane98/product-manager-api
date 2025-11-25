import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PhonesService } from './phones.service';

import { User } from 'src/common/decorator';
import { CreatePhonesDto, UpdatePhoneDto } from './dto';
import {
  CreatePhonesResponse,
  DeletePhoneResponse,
  UpdatePhoneResponse,
} from './types';

@Controller('phones')
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @Post()
  async createUserPhones(
    @User('user_id', new ParseUUIDPipe()) user_id: string,
    @Body() dto: CreatePhonesDto,
  ): Promise<CreatePhonesResponse> {
    return this.phonesService.createUserPhones(user_id, dto);
  }

  @Patch(':phone_id')
  async updatePhoneUser(
    @Param('phone_id', new ParseUUIDPipe()) phone_id: string,
    @Body() dto: UpdatePhoneDto,
  ): Promise<UpdatePhoneResponse> {
    return this.phonesService.updatePhoneUser(phone_id, dto);
  }

  @Delete(':phone_id')
  async deletePhone(
    @Param('phone_id', new ParseUUIDPipe()) phone_id: string,
  ): Promise<DeletePhoneResponse> {
    return this.phonesService.deletePhone(phone_id);
  }
}
