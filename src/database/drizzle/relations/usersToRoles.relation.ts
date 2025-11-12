import { relations } from 'drizzle-orm';
import { rolesTable, usersTable, usersToRolesTable } from '../schema';

export const usersToRolesRelations = relations(
  usersToRolesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToRolesTable.user_id],
      references: [usersTable.user_id],
    }),
    role: one(rolesTable, {
      fields: [usersToRolesTable.role_id],
      references: [rolesTable.role_id],
    }),
  }),
);
