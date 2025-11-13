import { uuid, numeric, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';
import { productsTable } from './products.schema';
import { colorsTable } from './colors.schema';
import { sizesTable } from './sizes.schema';

export const productVariantsTable = productManagementSchema.table(
  'product_variants',
  {
    variant_id: uuid('variant_id').defaultRandom(),
    product_id: uuid('product_id').notNull(),
    color_id: uuid('color_id').notNull(),
    size_id: uuid('size_id').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: 'pk_product_variants_variant_id',
      columns: [table.variant_id],
    }),
    foreignKey({
      name: 'fk_product_variants_product_id_products_product_id',
      columns: [table.product_id],
      foreignColumns: [productsTable.product_id],
    }),
    foreignKey({
      name: 'fk_product_variants_color_id_colors_color_id',
      columns: [table.color_id],
      foreignColumns: [colorsTable.color_id],
    }),
    foreignKey({
      name: 'fk_product_variants_size_id_sizes_size_id',
      columns: [table.size_id],
      foreignColumns: [sizesTable.size_id],
    }),
  ],
);
