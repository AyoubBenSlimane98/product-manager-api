import { relations } from 'drizzle-orm';
import { productVariantsTable, stocksTable } from '../schema';

export const stocksRelations = relations(stocksTable, ({ one }) => ({
  productVariant: one(productVariantsTable, {
    fields: [stocksTable.variant_id],
    references: [productVariantsTable.variant_id],
  }),
}));
