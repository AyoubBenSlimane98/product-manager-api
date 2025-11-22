import { relations } from 'drizzle-orm';
import { passwordResetTokensTable, usersTable } from '../schema';

export const passwordResetTokensRelations = relations(
  passwordResetTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [passwordResetTokensTable.user_id],
      references: [usersTable.user_id],
    }),
  }),
);
