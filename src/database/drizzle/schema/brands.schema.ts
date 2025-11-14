import { uuid, varchar, primaryKey, unique } from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';

export const brandsTable = productManagementSchema.table(
  'brands',
  {
    brand_id: uuid('brand_id').defaultRandom(),
    name: varchar('name', { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({ name: 'pk_brands_brand_id', columns: [table.brand_id] }),
    unique('uq_brands_name').on(table.name),
  ],
);
