import { relations } from 'drizzle-orm';
import { categoriesTable, categoriesToProductsTable } from '../schema';

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  categoriesToProducts: many(categoriesToProductsTable),
}));
