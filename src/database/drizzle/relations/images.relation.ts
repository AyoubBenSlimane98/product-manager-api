import { relations } from 'drizzle-orm';
import { imagesTable, productVariantsTable } from '../schema';

export const imagesRelations = relations(imagesTable, ({ one }) => ({
  productVariant: one(productVariantsTable, {
    fields: [imagesTable.variant_id],
    references: [productVariantsTable.variant_id],
  }),
}));
