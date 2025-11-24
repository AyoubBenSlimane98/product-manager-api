import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase, NodePgTransaction } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/drizzle/schema';
import { Argon2Service } from '../auth/argon2/argon2.service';
import { eq, sql } from 'drizzle-orm';
import { DatabaseError } from 'pg';
import { RevokeTokenResponse } from './types';

@Injectable()
export class TokensService {
  constructor(
    @Inject('DATABASE_CONNCTION')
    private readonly db: NodePgDatabase,
    private readonly argon: Argon2Service,
  ) {}
  private get Tokens() {
    return schema.tokensTable;
  }

  async revokeToken(user_id: string): Promise<RevokeTokenResponse> {
    try {
      const result = await this.db
        .update(this.Tokens)
        .set({ is_revoked: true })
        .where(eq(this.Tokens.user_id, user_id));
      if (result.rowCount === 0) {
        throw new NotFoundException('Token not found for this user');
      }
      return {
        message: 'Token revoked successfully',
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === '23503') {
          throw new NotFoundException('User not found');
        }
        if (error.code === '23505') {
          throw new ConflictException('Token already revoked');
        }
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }
  async storeToken(
    { user_id, rt }: { user_id: string; rt: string },
    tx?: NodePgTransaction<any, any>,
  ): Promise<void> {
    try {
      const hashed = await this.argon.hashData(rt);
      await (tx || this.db)
        .insert(this.Tokens)
        .values({
          user_id,
          hash_token: hashed,
          expires_at: sql`CURRENT_TIMESTAMP + INTERVAL '7 days'`,
        })
        .onConflictDoUpdate({
          target: this.Tokens.user_id,
          set: {
            hash_token: hashed,
            expires_at: sql`CURRENT_TIMESTAMP + INTERVAL '7 days'`,
          },
        });
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23503') {
        throw new ConflictException('User alreay sign up and have token');
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
