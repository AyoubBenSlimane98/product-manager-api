import { uuid, varchar, primaryKey, unique } from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';

export const sizesTable = productManagementSchema.table(
  'sizes',
  {
    size_id: uuid('size_id').defaultRandom(),
    name: varchar('name', { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({ name: 'pk_sizes_size_id', columns: [table.size_id] }),
    unique('uq_sizes_name').on(table.name),
  ],
);
