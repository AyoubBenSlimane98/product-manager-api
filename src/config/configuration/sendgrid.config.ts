import { registerAs } from '@nestjs/config';

export default registerAs('sendGrid', () => ({
  api: process.env.SENDGRID_API_KEY,
  email: process.env.SENDGRID_EMAIL,
}));
