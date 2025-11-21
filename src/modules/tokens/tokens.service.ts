import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NodePgDatabase, NodePgTransaction } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/drizzle/schema';
import { Argon2Service } from '../auth/argon2/argon2.service';
import { sql } from 'drizzle-orm';
import { DatabaseError } from 'pg';

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

  async storeToken(
    { user_id, rt }: { user_id: string; rt: string },
    tx?: NodePgTransaction<any, any>,
  ) {
    try {
      const hashed = await this.argon.hashData(rt);
      await (tx || this.db).insert(this.Tokens).values({
        user_id,
        hash_token: hashed,
        expires_at: sql`CURRENT_TIMESTAMP + INTERVAL '7 days'`,
      });
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23503') {
        throw new ConflictException('User alreay sign up and have token');
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
