import { relations } from 'drizzle-orm';
import { productsTable, usersTable, usersToProductsTable } from '../schema';

export const usersToProductsRelations = relations(
  usersToProductsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToProductsTable.user_id],
      references: [usersTable.user_id],
    }),
    product: one(productsTable, {
      fields: [usersToProductsTable.product_id],
      references: [productsTable.product_id],
    }),
  }),
);
