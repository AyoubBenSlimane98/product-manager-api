import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Argon2Service } from './argon2/argon2.service';
import { AuthJwtService } from './jwt/jwt.service';
import * as schema from '../../database/drizzle/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_CONNCTION') private readonly db: NodePgDatabase,
    private readonly argon: Argon2Service,
    private readonly jwt: AuthJwtService,
  ) {}
}
