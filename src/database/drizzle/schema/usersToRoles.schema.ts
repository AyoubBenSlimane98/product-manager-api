import { uuid, timestamp, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { usersTable } from './users.schema';
import { rolesTable } from './roles.schema';

export const usersToRolesTable = userManagementSchema.table(
  'users_to_roles',
  {
    user_id: uuid('user_id').notNull(),
    role_id: uuid('role_id').notNull(),
    assigned_at: timestamp('assigned_at').defaultNow(),
  },
  (table) => [
    primaryKey({
      name: 'pk_users_to_roles_user_id_role_id',
      columns: [table.user_id, table.role_id],
    }),
    foreignKey({
      name: 'fk_users_to_roles_user_id_users_user_id',
      columns: [table.user_id],
      foreignColumns: [usersTable.user_id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'fk_users_to_roles_role_id_roles_role_id',
      columns: [table.role_id],
      foreignColumns: [rolesTable.role_id],
    }).onDelete('cascade'),
  ],
);
