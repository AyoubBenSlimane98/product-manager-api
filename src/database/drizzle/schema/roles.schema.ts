import {
  uuid,
  varchar,
  text,
  timestamp,
  primaryKey,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';

export const rolesTable = userManagementSchema.table(
  'roles',
  {
    role_id: uuid('role_id').defaultRandom().notNull(),
    name: varchar('name').notNull(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at')
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    primaryKey({ name: 'pk_roles_role_id', columns: [table.role_id] }),
    unique('uq_roles_name').on(table.name),
    index('idx_roles_name').on(table.name),
    index('idx_roles_ created_at').on(table.created_at),
  ],
);
