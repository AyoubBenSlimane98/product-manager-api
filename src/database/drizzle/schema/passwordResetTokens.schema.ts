import {
  uuid,
  varchar,
  timestamp,
  primaryKey,
  foreignKey,
  index,
} from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { usersTable } from './users.schema';
import { unique } from 'drizzle-orm/pg-core';

export const passwordResetTokensTable = userManagementSchema.table(
  'password_reset_tokens',
  {
    token_id: uuid('token_id').defaultRandom().notNull(),
    user_id: uuid('user_id').notNull(),
    token_hash: varchar('token_hash', { length: 255 }).notNull(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({
      name: 'password_reset_tokens_token_id',
      columns: [table.token_id],
    }),
    foreignKey({
      name: 'fk_password_reset_tokens_user_id_users_user_id',
      columns: [table.user_id],
      foreignColumns: [usersTable.user_id],
    }).onDelete('cascade'),
    unique('uq_password_reset_tokens_user_id').on(table.user_id),
    index('idx_password_reset_tokens_token_hash').on(table.token_hash),
  ],
);
