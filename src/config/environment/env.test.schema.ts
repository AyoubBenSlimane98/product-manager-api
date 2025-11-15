import { z } from 'zod';
import { BaseEnvSchema } from './env.development.schema';

export const TestEnvSchema = BaseEnvSchema.extend({
  PORT: z.string().default('3001'),
  POSTGRES_USER: z.string().nonempty(),
  POSTGRES_PASSWORD: z.string().nonempty(),
  POSTGRES_DB: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
});
