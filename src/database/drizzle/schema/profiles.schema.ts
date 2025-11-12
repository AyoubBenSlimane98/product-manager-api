import {
  uuid,
  varchar,
  text,
  primaryKey,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { usersTable } from './users.schema';

export const profilesTable = userManagementSchema.table(
  'profiles',
  {
    profile_id: uuid('profile_id').defaultRandom(),
    user_id: uuid('user_id').notNull(),
    first_name: varchar('first_name', { length: 50 }).notNull(),
    last_name: varchar('last_name', { length: 50 }).notNull(),
    avatar_url: text('avatar_url'),
  },
  (table) => [
    primaryKey({ name: 'pk_profiles_profile_id', columns: [table.profile_id] }),
    foreignKey({
      name: 'fk_profiles_user_id_users_user_id',
      columns: [table.user_id],
      foreignColumns: [usersTable.user_id],
    }),
    unique('uq_profiles_user_id').on(table.user_id),
  ],
);
