import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/drizzle/schema';
import {
  AllUsersResponse,
  BlockedUserResponse,
  DeletedUserResponse,
  ChangePasswordUserResponse,
  UserResponse,
} from './types';
import { eq } from 'drizzle-orm';
import { CreateUserDto, UpdatePasswordUserDto, UpdateUserDto } from './dto';
import { Argon2Service } from '../auth/argon2/argon2.service';
import { RolesService } from '../roles/roles.service';
import { DatabaseError } from 'pg';
import { CreateUserResponse } from './types/create-user.type';
import { UpdateUserResponse } from './types/update-user.type';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNCTION')
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly argon: Argon2Service,
    private readonly rolesService: RolesService,
  ) {}
  private get Users() {
    return schema.usersTable;
  }

  async getAllusers(): Promise<AllUsersResponse> {
    try {
      const allusers = await this.db
        .select({
          user_id: this.Users.user_id,
          username: this.Users.username,
          email: this.Users.email,
          is_blocked: this.Users.is_blocked,
          created_at: this.Users.created_at,
        })
        .from(this.Users);
      return {
        message: 'All users returned successfully',
        users: allusers,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected database error: ${error.message}`
          : 'Unexpected database error',
      );
    }
  }

  async getUser(user_id: string): Promise<UserResponse> {
    try {
      const [user] = await this.db
        .select({
          user_id: this.Users.user_id,
          username: this.Users.username,
          email: this.Users.email,
          is_blocked: this.Users.is_blocked,
          created_at: this.Users.created_at,
        })
        .from(this.Users)
        .where(eq(this.Users.user_id, user_id))
        .limit(1);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        message: 'User retrieved successfully',
        user,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected database error: ${error.message}`
          : 'Unexpected database error',
      );
    }
  }

  async createUser(dto: CreateUserDto): Promise<CreateUserResponse> {
    const { username, email, password, roles } = dto;
    try {
      return await this.db.transaction(async (tx) => {
        const hashPassword = await this.argon.hashData(password);
        const [resultUser] = await tx
          .insert(this.Users)
          .values({ username, email, password: hashPassword })
          .returning({
            user_id: this.Users.user_id,
          });
        await Promise.all(
          roles.map(async (role) => {
            const result = await this.rolesService.getRole(role, tx);
            return this.rolesService.assignRole(
              {
                user_id: resultUser.user_id,
                role_id: result.role.role_id,
              },
              tx,
            );
          }),
        );
        return {
          message: 'Created Account and roles assigned successfully',
          user_id: resultUser.user_id,
        };
      });
    } catch (error: unknown) {
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ConflictException('User or assigned role already exists');
      }
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected database error: ${error.message}`
          : 'Unexpected database error ',
      );
    }
  }

  async updateUser(
    user_id: string,
    dto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    try {
      const filterDto = Object.fromEntries(
        Object.entries(dto).filter(([, value]) => value !== undefined),
      );
      if (Object.keys(filterDto).length === 0) {
        return { message: 'Nothing to update', user_id };
      }
      await this.db
        .update(this.Users)
        .set(filterDto)
        .where(eq(this.Users.user_id, user_id));
      return {
        message: 'Update user successfully',
        user_id,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected database error: ${error.message}`
          : 'Unexpected database error',
      );
    }
  }

  async changePasswordUser(
    user_id: string,
    dto: UpdatePasswordUserDto,
  ): Promise<ChangePasswordUserResponse> {
    const { oldPassword, newPassword } = dto;
    try {
      const [user] = await this.db
        .select({ user_id: this.Users.user_id, password: this.Users.password })
        .from(this.Users)
        .where(eq(this.Users.user_id, user_id));
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isMateched = await this.argon.verifyData(
        user.password,
        oldPassword,
      );
      if (!isMateched) {
        throw new UnauthorizedException('Old password is incorrect');
      }
      const hashPassword = await this.argon.hashData(newPassword);
      await this.db
        .update(this.Users)
        .set({ password: hashPassword })
        .where(eq(this.Users.user_id, user.user_id));
      return {
        message: 'Password updated successfully',
        user_id,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected database error: ${error.message}`
          : 'Unexpected database error',
      );
    }
  }

  async blockAccountUser(user_id: string): Promise<BlockedUserResponse> {
    try {
      const resultuser = await this.getUser(user_id);
      if (resultuser.user.is_blocked) {
        return {
          message: 'User is already blocked',
          user_id,
        };
      }
      await this.db
        .update(this.Users)
        .set({ is_blocked: true })
        .where(eq(this.Users.user_id, user_id));
      return {
        message: 'Blocked user successfully',
        user_id,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected database error: ${error.message}`
          : 'Unexpected database error',
      );
    }
  }

  async deleteUser(user_id: string): Promise<DeletedUserResponse> {
    try {
      const reslutUser = await this.getUser(user_id);
      await this.db
        .delete(this.Users)
        .where(eq(this.Users.user_id, reslutUser.user.user_id));
      return {
        message: 'Deleted user successfully',
        user_id,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected database error: ${error.message}`
          : 'Unexpected database error',
      );
    }
  }
}
