import {
  uuid,
  varchar,
  text,
  timestamp,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';
import { brandsTable } from './brands.schema';

export const productsTable = productManagementSchema.table(
  'products',
  {
    product_id: uuid('product_id').defaultRandom(),
    brand_id: uuid('brand_id').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({ name: 'pk_products_product_id', columns: [table.product_id] }),
    foreignKey({
      name: 'fk_products_brand_id_brands_brand_id',
      columns: [table.brand_id],
      foreignColumns: [brandsTable.brand_id],
    }),
  ],
);
