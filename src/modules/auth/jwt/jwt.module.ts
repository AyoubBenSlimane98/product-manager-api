import { Module } from '@nestjs/common';
import { AuthJwtService } from './jwt.service';

@Module({
  providers: [AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}
