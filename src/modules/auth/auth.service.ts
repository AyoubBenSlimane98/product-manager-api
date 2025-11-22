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
import {
  ConfirmPasswordDto,
  LocalLoginDto,
  LocalSignupDto,
  RefreshTokenDto,
  ReqPasswordDto,
} from './dto';
import { RolesService } from '../roles/roles.service';
import { DatabaseError } from 'pg';
import { TokensService } from '../tokens/tokens.service';
import {
  LocalLoginResponse,
  LocalSignupResponse,
  LogoutResponse,
  ReqPasswordResponse,
  ConfirmPasswordResponse,
} from './types';
import { eq, sql } from 'drizzle-orm';
import { MailService } from './send-grid/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_CONNCTION')
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly argon: Argon2Service,
    private readonly jwt: AuthJwtService,
    private readonly rolesService: RolesService,
    private readonly tokensService: TokensService,
    private readonly mailService: MailService,
  ) {}
  private get Users() {
    return schema.usersTable;
  }
  private get Tokens() {
    return schema.tokensTable;
  }
  private get PrTokens() {
    return schema.passwordResetTokensTable;
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

  async refresh(
    user: { user_id: string; roles: string[] },
    dto: RefreshTokenDto,
  ) {
    const [tokenResult] = await this.db
      .select({
        hash_token: this.Tokens.hash_token,
        expires_at: this.Tokens.expires_at,
      })
      .from(this.Tokens)
      .where(eq(this.Tokens.user_id, user.user_id))
      .limit(1);
    if (!tokenResult) {
      throw new UnauthorizedException('Token not found');
    }
    if (new Date(tokenResult.expires_at) < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const isMatched = await this.argon.verifyData(
      tokenResult.hash_token,
      dto.refresh_token,
    );
    if (!isMatched) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const at_token = await this.jwt.generateAccessToken(user);
    return {
      access_token: at_token.access_token,
    };
  }

  async requestPassword(dto: ReqPasswordDto): Promise<ReqPasswordResponse> {
    try {
      const [user] = await this.db
        .select({ user_id: this.Users.user_id, email: this.Users.email })
        .from(this.Users)
        .where(eq(this.Users.email, dto.email))
        .limit(1);
      if (!user)
        return { message: 'If the email exists, a reset link has been sent' };
      const { access_token } = await this.jwt.generateAccessToken({
        user_id: user.user_id,
      });
      const hashToken = await this.argon.hashData(access_token);
      await this.db
        .insert(this.PrTokens)
        .values({
          user_id: user.user_id,
          token_hash: hashToken,
          expires_at: sql`CURRENT_TIMESTAMP + INTERVAL '15m'`,
        })
        .onConflictDoUpdate({
          target: this.PrTokens.user_id,
          set: {
            token_hash: hashToken,
            expires_at: sql`CURRENT_TIMESTAMP + INTERVAL '15m'`,
          },
        });
      await this.mailService.sendResetPassword(user.email, access_token);
      return { message: 'If the email exists, a reset link has been sent' };
    } catch {
      throw new Error('Failed to request password reset');
    }
  }

  async confirmPassword(
    dto: ConfirmPasswordDto,
  ): Promise<ConfirmPasswordResponse> {
    const { token, password } = dto;
    try {
      const payload = await this.jwt.verifyToken(token);
      if (!payload) {
        throw new UnauthorizedException('invalid token');
      }
      const [tokenResult] = await this.db
        .select({
          token_id: this.PrTokens.token_id,
          user_id: this.PrTokens.user_id,
          token_hash: this.PrTokens.token_hash,
          expires_at: this.PrTokens.expires_at,
        })
        .from(this.PrTokens)
        .where(eq(this.PrTokens.user_id, payload.user_id))
        .limit(1);
      if (!tokenResult) {
        throw new UnauthorizedException('Not found token');
      }
      if (new Date(tokenResult.expires_at) < new Date()) {
        throw new UnauthorizedException('Token expired');
      }

      const isMatched = await this.argon.verifyData(
        tokenResult.token_hash,
        token,
      );
      if (!isMatched) {
        throw new UnauthorizedException('invalid token');
      }
      const hashedPassword = await this.argon.hashData(password);
      await this.db
        .update(this.Users)
        .set({ password: hashedPassword })
        .where(eq(this.Users.user_id, tokenResult.user_id));
      await this.db
        .delete(this.PrTokens)
        .where(eq(this.PrTokens.token_id, tokenResult.token_id));
      return {
        message: 'Password change succesfully',
      };
    } catch {
      throw new InternalServerErrorException('Failed to reset password');
    }
  }
}
