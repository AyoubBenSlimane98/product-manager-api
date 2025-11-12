import { uuid, varchar, primaryKey, unique } from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';

export const rolesTable = userManagementSchema.table(
  'roles',
  {
    role_id: uuid('role_id').defaultRandom(),
    name: varchar('name').notNull(),
  },
  (table) => [
    primaryKey({ name: 'pk_roles_role_id', columns: [table.role_id] }),
    unique('uq_roles_name').on(table.name),
  ],
);
