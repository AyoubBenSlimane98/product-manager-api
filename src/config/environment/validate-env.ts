import * as fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { getEnvSchema } from './env.schemas.ts';

export function validateEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const envFile = path.resolve(process.cwd(), `.env.${nodeEnv}`);

  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    console.warn(
      `Env file ${envFile} not found. Using system environment variables.`,
    );
  }

  const schema = getEnvSchema(nodeEnv);
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables: ');
    parsed.error.issues.forEach((issue) => {
      console.error(`${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  return parsed.data;
}
