import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Argon2Service } from './argon2/argon2.service';
import { AuthJwtService } from './jwt/jwt.service';
import * as schema from '../../database/drizzle/schema';
import { LocalLoginDto, LocalSignupDto } from './dto';
import { RolesService } from '../roles/roles.service';
import { DatabaseError } from 'pg';
import { TokensService } from '../tokens/tokens.service';
import {
  LocalLoginResponse,
  LocalSignupResponse,
  LogoutResponse,
} from './types';
import { eq } from 'drizzle-orm';

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
  private get Tokens() {
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

  async localLogin(dto: LocalLoginDto): Promise<LocalLoginResponse> {
    const { email, password } = dto;
    return this.db.transaction(async (tx) => {
      const [user] = await tx
        .select({
          user_id: this.Users.user_id,
          email: this.Users.email,
          hashPassword: this.Users.password,
        })
        .from(this.Users)
        .where(eq(this.Users.email, email))
        .limit(1);
      if (!user) {
        throw new UnauthorizedException('Email or password is incorrect');
      }

      const isMatched = await this.argon.verifyData(
        user.hashPassword,
        password,
      );
      if (!isMatched) {
        throw new UnauthorizedException('Email or password is incorrect');
      }

      const rolesResult = await this.rolesService.getRolesOfUser(
        user.user_id,
        tx,
      );
      const roles = rolesResult.roles.map((r) => r.name);

      const tokens = await this.jwt.generateTokens({
        user_id: user.user_id,
        roles: roles,
      });

      await this.tokensService.storeToken(
        {
          user_id: user.user_id,
          rt: tokens.refresh_token,
        },
        tx,
      );

      return {
        message: 'Logging successfully',
        user_id: user.user_id,
        tokens,
      };
    });
  }

  async logout(user_id: string): Promise<LogoutResponse> {
    const deleteResult = await this.db
      .delete(this.Tokens)
      .where(eq(this.Tokens.user_id, user_id));

    return {
      message:
        deleteResult.rowCount !== 0
          ? 'Logout successfully'
          : 'No active session found',
      user_id,
    };
  }

  async refresh() {}

  async requestPassword() {}

  async confirmPassword() {}
}
