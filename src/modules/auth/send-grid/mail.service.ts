import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService) {
    sgMail.setApiKey(config.getOrThrow<string>('sendGrid.api'));
  }

  async sendResetPassword(email: string, token: string) {
    const resetLink = `https://product-manager.com/reset-password?token=${token}`;
    const msg = {
      to: email,
      from: this.config.getOrThrow<string>('sendGrid.email'),
      subject: 'Reset Your Password',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };
    try {
      await sgMail.send(msg);
      return {
        message: `Reset password email sent to ${email}`,
      };
    } catch {
      throw new Error('Failed to send email');
    }
  }
}
