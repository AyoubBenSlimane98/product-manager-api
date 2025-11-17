import { registerAs } from '@nestjs/config';

export default registerAs('argon2', () => ({
  secret: process.env.ARGON2_SECRET,
  timeCost: parseInt(process.env.ARGON2_TIME_COST ?? '3', 10),
  memoryCost: parseInt(process.env.ARGON2_MEMORY_COST ?? '65536', 10),
  parallelism: parseInt(process.env.ARGON2_PARALLELISM ?? '1', 10),
}));
