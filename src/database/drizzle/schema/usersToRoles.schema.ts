import { integer, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { usersTable } from './users.schema';
import { rolesTable } from './roles.schema';

export const usersToRolesTable = userManagementSchema.table(
  'users_to_roles',
  {
    user_id: integer('user_id').notNull(),
    role_id: integer('role_id').notNull(),
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
    }),
    foreignKey({
      name: 'fk_users_to_roles_role_id_roles_role_id',
      columns: [table.role_id],
      foreignColumns: [rolesTable.role_id],
    }),
  ],
);
