import { relations } from 'drizzle-orm';
import { brandsTable, productsTable } from '../schema';

export const brandsRelations = relations(brandsTable, ({ many }) => ({
  products: many(productsTable),
}));
