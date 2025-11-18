import {
  uuid,
  text,
  timestamp,
  boolean,
  primaryKey,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { usersTable } from './users.schema';

export const tokensTable = userManagementSchema.table(
  'tokens',
  {
    token_id: uuid('token_id').defaultRandom(),
    user_id: uuid('user_id').notNull(),
    refresh_token: text('refresh_token').notNull(),
    device_info: text('device_info'),
    expires_at: timestamp('expires_at').notNull(),
    is_revoked: boolean('is_revoked').default(false),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({ name: 'pk_tokens_token_id', columns: [table.token_id] }),
    foreignKey({
      name: 'fk_tokens_user_id_users_user_id',
      columns: [table.user_id],
      foreignColumns: [usersTable.user_id],
    }),
    unique('uq_tokens_refresh_token').on(table.refresh_token),
  ],
);
