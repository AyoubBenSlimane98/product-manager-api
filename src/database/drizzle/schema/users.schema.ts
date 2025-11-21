import {
  uuid,
  varchar,
  timestamp,
  primaryKey,
  unique,
} from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';

export const usersTable = userManagementSchema.table(
  'users',
  {
    user_id: uuid('user_id').defaultRandom().notNull(),
    username: varchar('username', { length: 50 }).notNull(),
    email: varchar('email').notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({ name: 'pk_users_user_id', columns: [table.user_id] }),
    unique('uq_users_email').on(table.email),
  ],
);
