import { relations } from 'drizzle-orm';
import { colorsTable, productVariantsTable } from '../schema';

export const colorsRelations = relations(colorsTable, ({ many }) => ({
  productVariants: many(productVariantsTable),
}));
