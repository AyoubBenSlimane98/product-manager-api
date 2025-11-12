import { relations } from 'drizzle-orm';
import { profilesTable, usersTable, usersToRolesTable } from '../schema';

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  profiles: one(profilesTable),
  usersToRoles: many(usersToRolesTable),
}));
