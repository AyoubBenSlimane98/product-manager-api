import { uuid, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';
import { categoriesTable } from './categories.schema';
import { productsTable } from './products.schema';

export const categoriesToProductsTable = productManagementSchema.table(
  'categories_to_products',
  {
    category_id: uuid('category_id').notNull(),
    product_id: uuid('product_id').notNull(),
  },
  (table) => [
    primaryKey({
      name: 'pk_categories_to_products_category_id_product_id',
      columns: [table.category_id, table.product_id],
    }),
    foreignKey({
      name: 'fk_categories_to_products_category_id_categories_category_id',
      columns: [table.category_id],
      foreignColumns: [categoriesTable.category_id],
    }),
    foreignKey({
      name: 'fk_categories_to_products_product_id_products_product_id',
      columns: [table.product_id],
      foreignColumns: [productsTable.product_id],
    }),
  ],
);
