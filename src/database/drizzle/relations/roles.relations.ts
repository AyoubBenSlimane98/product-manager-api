import { relations } from 'drizzle-orm';
import { rolesTable, usersToRolesTable } from '../schema';

export const rolesRelations = relations(rolesTable, ({ many }) => ({
  usersToRoles: many(usersToRolesTable),
}));
