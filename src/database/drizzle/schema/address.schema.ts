import { uuid, varchar, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { profilesTable } from './profiles.schema';

export const addressesTable = userManagementSchema.table(
  'addresses',
  {
    address_id: uuid('address_id').defaultRandom(),
    profile_id: uuid('profile_id').notNull(),
    country: varchar('country', { length: 50 }).notNull(),
    city: varchar('city', { length: 50 }).notNull(),
    street: varchar('street', { length: 100 }),
    postal_code: varchar('postal_code', { length: 20 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: 'pk_addresses_address_id',
      columns: [table.address_id],
    }),
    foreignKey({
      name: 'fk_addresses_profile_id_profiles_profile_id',
      columns: [table.profile_id],
      foreignColumns: [profilesTable.profile_id],
    }),
  ],
);
