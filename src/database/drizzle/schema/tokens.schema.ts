import {
  uuid,
  text,
  timestamp,
  boolean,
  primaryKey,
  foreignKey,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { usersTable } from './users.schema';

export const tokensTable = userManagementSchema.table(
  'tokens',
  {
    token_id: uuid('token_id').defaultRandom().notNull(),
    user_id: uuid('user_id').notNull(),
    hash_token: text('hash_token').notNull(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    is_revoked: boolean('is_revoked').default(false),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({ name: 'pk_tokens_token_id', columns: [table.token_id] }),
    foreignKey({
      name: 'fk_tokens_user_id_users_user_id',
      columns: [table.user_id],
      foreignColumns: [usersTable.user_id],
    }).onDelete('cascade'),
    unique('uq_tokens_hash_token').on(table.hash_token),
    index('idx_tokens_user_id').on(table.user_id),
  ],
);
