import { relations } from 'drizzle-orm';
import { addressesTable, profilesTable } from '../schema';

export const addressesRelations = relations(addressesTable, ({ one }) => ({
  profiles: one(profilesTable, {
    fields: [addressesTable.profile_id],
    references: [profilesTable.profile_id],
  }),
}));
