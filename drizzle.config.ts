import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './src/database/migrations',
  schema: ['./src/database/drizzle/schema'],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});
