import { z } from 'zod';
export const BaseEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export const DevEnvSchema = BaseEnvSchema.extend({
  PORT: z.string().default('3000'),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  DATABASE_URL: z.string().optional(),
});
