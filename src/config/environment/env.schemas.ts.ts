import { DevEnvSchema } from './env.development.schema';
import { ProdEnvSchema } from './env.production.schema';
import { TestEnvSchema } from './env.test.schema';

export type EnvSchemaType =
  | typeof DevEnvSchema
  | typeof TestEnvSchema
  | typeof ProdEnvSchema;

export function getEnvSchema(nodeEnv: string): EnvSchemaType {
  switch (nodeEnv) {
    case 'production':
      return ProdEnvSchema;
    case 'test':
      return TestEnvSchema;
    default:
      return DevEnvSchema;
  }
}
