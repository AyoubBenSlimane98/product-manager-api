import { uuid, integer, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';
import { productVariantsTable } from './productVariants.schema';

export const stocksTable = productManagementSchema.table(
  'stocks',
  {
    stock_id: uuid('stock_id').defaultRandom(),
    variant_id: uuid('variant_id').notNull(),
    quantity: integer('quantity').default(0),
  },
  (table) => [
    primaryKey({ name: 'pk_stocks_stock_id', columns: [table.stock_id] }),
    foreignKey({
      name: 'fk_stocks_variant_id_product_variants_variant_id',
      columns: [table.variant_id],
      foreignColumns: [productVariantsTable.variant_id],
    }),
  ],
);
