import { relations } from 'drizzle-orm';
import {
  addressesTable,
  phonesTable,
  profilesTable,
  usersTable,
} from '../schema';

export const profilesRelations = relations(profilesTable, ({ one, many }) => ({
  users: one(usersTable, {
    fields: [profilesTable.user_id],
    references: [usersTable.user_id],
  }),
  addresses: many(addressesTable),
  phones: many(phonesTable),
}));
