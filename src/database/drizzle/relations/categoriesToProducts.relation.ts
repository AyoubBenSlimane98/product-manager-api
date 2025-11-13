import { relations } from 'drizzle-orm';
import {
  categoriesTable,
  categoriesToProductsTable,
  productsTable,
} from '../schema';

export const categoriesToProductsRelations = relations(
  categoriesToProductsTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [categoriesToProductsTable.product_id],
      references: [productsTable.product_id],
    }),
    category: one(categoriesTable, {
      fields: [categoriesToProductsTable.category_id],
      references: [categoriesTable.category_id],
    }),
  }),
);
