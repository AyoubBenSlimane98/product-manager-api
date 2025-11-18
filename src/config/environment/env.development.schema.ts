import { z } from 'zod';
export const BaseEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export const DevEnvSchema = BaseEnvSchema.extend({
  PORT: z.string().default('3000'),
  // postgreSQL
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  // cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
  CLOUDINARY_API_KEY: z.string().nonempty(),
  CLOUDINARY_API_SECRET: z.string().nonempty(),
  // argon2
  ARGON2_SECRET: z.string().nonempty(),
  ARGON2_TIME_COST: z.coerce.number().int().nonnegative().default(3),
  ARGON2_MEMORY_COST: z.coerce.number().int().nonnegative().default(64),
  ARGON2_PARALLELISM: z.coerce.number().int().nonnegative().default(1),
});
