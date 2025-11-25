import {
  pgEnum,
  uuid,
  varchar,
  boolean,
  timestamp,
  primaryKey,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { profilesTable } from './profiles.schema';

export const typePhoneEnum = pgEnum('typePhone', ['mobile', 'home', 'work']);

export const phonesTable = userManagementSchema.table(
  'phones',
  {
    phone_id: uuid('phone_id').defaultRandom().notNull(),
    profile_id: uuid('profile_id').notNull(),
    country_code: varchar('country_code', { length: 5 }).notNull(),
    phone_number: varchar('phone_number', { length: 20 }).notNull(),
    type: typePhoneEnum('type').default('mobile'),
    is_primary: boolean('is_primary').default(false),
    created_at: timestamp('created_at').defaultNow(),
    update_at: timestamp('update_at').defaultNow(),
  },
  (table) => [
    primaryKey({ name: 'pk_phones_phone_id', columns: [table.phone_id] }),
    foreignKey({
      name: 'fk_phones_profile_id_profiles_profile_id',
      columns: [table.profile_id],
      foreignColumns: [profilesTable.profile_id],
    }).onDelete('cascade'),
    unique('uq_phones_country_code_phone_number').on(
      table.country_code,
      table.phone_number,
    ),
  ],
);
