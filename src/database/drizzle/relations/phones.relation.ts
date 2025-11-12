import { relations } from 'drizzle-orm';
import { phonesTable, profilesTable } from '../schema';

export const phonesRelations = relations(phonesTable, ({ one }) => ({
  profiles: one(profilesTable, {
    fields: [phonesTable.profile_id],
    references: [profilesTable.profile_id],
  }),
}));
