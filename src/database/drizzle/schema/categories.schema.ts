import { uuid, varchar, text, primaryKey, unique } from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';

export const categoriesTable = productManagementSchema.table(
  'categories',
  {
    category_id: uuid('category_id').defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
  },
  (table) => [
    primaryKey({
      name: 'pk_categories_category_id',
      columns: [table.category_id],
    }),
    unique('uq_categories_name').on(table.name),
  ],
);
