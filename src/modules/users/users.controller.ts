import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AllUsersResponse,
  BlockedUserResponse,
  DeletedUserResponse,
  ChangePasswordUserResponse,
  UserResponse,
} from './types';
import { Role, Roles, User } from 'src/common/decorator';
import { CreateUserDto, UpdatePasswordUserDto, UpdateUserDto } from './dto';
import { CreateUserResponse } from './types/create-user.type';
import { UpdateUserResponse } from './types/update-user.type';
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async getAllusers(): Promise<AllUsersResponse> {
    return this.usersService.getAllusers();
  }

  @Get(':user_id')
  async getUser(
    @Param('user_id', new ParseUUIDPipe()) user_id: string,
  ): Promise<UserResponse> {
    return this.usersService.getUser(user_id);
  }

  @Post('create')
  async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResponse> {
    return this.usersService.createUser(dto);
  }

  @Roles(Role.ADMIN, Role.PRODUCT_MANAGER, Role.USER)
  @Patch('me')
  async updateUser(
    @User('user_id', new ParseUUIDPipe()) user_id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    return this.usersService.updateUser(user_id, dto);
  }

  @Roles(Role.ADMIN, Role.PRODUCT_MANAGER, Role.USER)
  @Patch('password')
  async changePasswordUser(
    @User('user_id', new ParseUUIDPipe()) user_id: string,
    @Body() dto: UpdatePasswordUserDto,
  ): Promise<ChangePasswordUserResponse> {
    return this.usersService.changePasswordUser(user_id, dto);
  }

  @Patch(':user_id/block')
  async blockAccountUser(
    @Param('user_id', new ParseUUIDPipe()) user_id: string,
  ): Promise<BlockedUserResponse> {
    return this.usersService.blockAccountUser(user_id);
  }

  @Delete(':user_id')
  async deleteUser(
    @Param('user_id', new ParseUUIDPipe()) user_id: string,
  ): Promise<DeletedUserResponse> {
    return this.usersService.deleteUser(user_id);
  }
}
