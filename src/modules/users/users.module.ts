import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Argon2Module } from '../auth/argon2/argon2.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [Argon2Module, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
