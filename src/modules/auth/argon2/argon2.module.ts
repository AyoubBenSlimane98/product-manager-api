import { Module } from '@nestjs/common';
import { Argon2Service } from './argon2.service';

@Module({
  providers: [Argon2Service],
  exports: [Argon2Service],
})
export class Argon2Module {}
