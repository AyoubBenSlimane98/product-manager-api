import { relations } from 'drizzle-orm';
import {
  profilesTable,
  tokensTable,
  usersTable,
  usersToProductsTable,
  usersToRolesTable,
} from '../schema';

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  profiles: one(profilesTable),
  usersToRoles: many(usersToRolesTable),
  usersToProducts: many(usersToProductsTable),
  token: one(tokensTable),
}));
