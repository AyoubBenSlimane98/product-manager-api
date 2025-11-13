import { relations } from 'drizzle-orm';
import {
  colorsTable,
  imagesTable,
  productsTable,
  productVariantsTable,
  sizesTable,
  stocksTable,
} from '../schema';

export const productVariantsRelations = relations(
  productVariantsTable,
  ({ one, many }) => ({
    product: one(productsTable, {
      fields: [productVariantsTable.product_id],
      references: [productsTable.product_id],
    }),
    color: one(colorsTable, {
      fields: [productVariantsTable.color_id],
      references: [colorsTable.color_id],
    }),
    size: one(sizesTable, {
      fields: [productVariantsTable.size_id],
      references: [sizesTable.size_id],
    }),
    stocks: many(stocksTable),
    images: many(imagesTable),
  }),
);
