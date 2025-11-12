import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DATABASE_CONNCTION = 'DATABASE_CONNCTION';
@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNCTION,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: config.getOrThrow('database.url'),
        });
        console.log(config.getOrThrow('database.url'));
        return drizzle(pool, { schema: {} });
      },
    },
  ],
  exports: [DATABASE_CONNCTION],
})
export class DatabaseModule {}
