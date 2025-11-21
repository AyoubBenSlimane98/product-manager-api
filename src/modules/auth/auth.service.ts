import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Argon2Service } from './argon2/argon2.service';
import { AuthJwtService } from './jwt/jwt.service';
import * as schema from '../../database/drizzle/schema';
import { LocalSignupDto } from './dto';
import { RolesService } from '../roles/roles.service';
import { DatabaseError } from 'pg';
import { TokensService } from '../tokens/tokens.service';
import { LocalSignupResponse } from './types';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_CONNCTION')
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly argon: Argon2Service,
    private readonly jwt: AuthJwtService,
    private readonly rolesService: RolesService,
    private readonly tokensService: TokensService,
  ) {}
  private get Users() {
    return schema.usersTable;
  }
  async localSignup(dto: LocalSignupDto): Promise<LocalSignupResponse> {
    const { username, email, password } = dto;

    try {
      return await this.db.transaction(async (tx) => {
        const hashedPassword = await this.argon.hashData(password);
        const [user] = await tx
          .insert(this.Users)
          .values({ username, email, password: hashedPassword })
          .returning({
            user_id: this.Users.user_id,
            username: this.Users.username,
            created_at: this.Users.created_at,
          });
        if (!user) {
          throw new ConflictException('Email already used');
        }
        const roleUser = await this.rolesService.getRole('USER', tx);
        await this.rolesService.assignRole(
          {
            user_id: user.user_id,
            role_id: roleUser.role.role_id,
          },
          tx,
        );
        const tokens = await this.jwt.generateTokens({
          user_id: user.user_id,
          roles: ['USER'],
        });
        await this.tokensService.storeToken(
          {
            user_id: user.user_id,
            rt: tokens.refresh_token,
          },
          tx,
        );
        return {
          message: 'User created and default role assigned successfully',
          user,
          tokens,
        };
      });
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ConflictException('Role already assigned to this user');
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async localLogin() {}

  async logout() {}

  async refresh() {}

  async requestPassword() {}

  async confirmPassword() {}
}
