import {
  uuid,
  timestamp,
  integer,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { userManagementSchema } from './schema.db';
import { usersTable } from './users.schema';
import { productsTable } from './products.schema';

export const usersToProductsTable = userManagementSchema.table(
  'users_to_products',
  {
    user_id: uuid('user_id').notNull(),
    product_id: uuid('product_id').notNull(),
    purchase_date: timestamp('purchase_date').defaultNow(),
    quantity: integer('quantity').notNull(),
  },
  (table) => [
    primaryKey({
      name: 'pk_users_to_products_user_id_product_id_purchase_date',
      columns: [table.user_id, table.product_id, table.purchase_date],
    }),
    foreignKey({
      name: 'fk_users_to_products_user_id_users_user_id',
      columns: [table.user_id],
      foreignColumns: [usersTable.user_id],
    }),
    foreignKey({
      name: 'fk_users_to_products_product_id_products_product_id',
      columns: [table.product_id],
      foreignColumns: [productsTable.product_id],
    }),
  ],
);
