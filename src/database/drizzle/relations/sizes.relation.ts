import { relations } from 'drizzle-orm';
import { productVariantsTable, sizesTable } from '../schema';

export const sizesRelations = relations(sizesTable, ({ many }) => ({
  productVariants: many(productVariantsTable),
}));
