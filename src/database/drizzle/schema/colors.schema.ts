import { uuid, varchar, primaryKey, unique } from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';

export const colorsTable = productManagementSchema.table(
  'colors',
  {
    color_id: uuid('color_id').defaultRandom(),
    name: varchar('name', { length: 50 }).notNull(),
    hex_code: varchar('hex_code', { length: 7 }).notNull(),
  },
  (table) => [
    primaryKey({ name: 'pk_colors_color_id', columns: [table.color_id] }),
    unique('uq_colors_name_hex_code').on(table.name, table.hex_code),
  ],
);
