import { relations } from 'drizzle-orm';
import { tokensTable, usersTable } from '../schema';

export const tokensRelations = relations(tokensTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [tokensTable.user_id],
    references: [usersTable.user_id],
  }),
}));
