import { uuid, text, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { productManagementSchema } from './schema.db';
import { productVariantsTable } from './productVariants.schema';

export const imagesTable = productManagementSchema.table(
  'images',
  {
    image_id: uuid('image_id').defaultRandom(),
    variant_id: uuid('variant_id').notNull(),
    url: text('url').notNull(),
  },
  (table) => [
    primaryKey({ name: 'pk_images_variant_id', columns: [table.variant_id] }),
    foreignKey({
      name: 'fk_images_variant_id_product_variants_variant_id',
      columns: [table.variant_id],
      foreignColumns: [productVariantsTable.variant_id],
    }),
  ],
);
