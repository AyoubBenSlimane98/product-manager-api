import { relations } from 'drizzle-orm';
import {
  brandsTable,
  categoriesToProductsTable,
  productsTable,
} from '../schema';

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  brand: one(brandsTable, {
    fields: [productsTable.brand_id],
    references: [brandsTable.brand_id],
  }),
  product_variants: many(productsTable),
  categoriesToProducts: many(categoriesToProductsTable),
}));
