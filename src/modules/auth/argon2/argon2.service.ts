import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class Argon2Service {
  constructor(private readonly config: ConfigService) {}
  async hashData(data: string): Promise<string> {
    return await argon2.hash(data, {
      type: argon2.argon2id,
      timeCost: this.config.getOrThrow<number>('argon2.timeCost'),
      memoryCost: this.config.getOrThrow<number>('argon2.memoryCost'),
      parallelism: this.config.getOrThrow<number>('argon2.parallelism'),
      secret: Buffer.from(this.config.getOrThrow<string>('argon2.secret')),
    });
  }

  async verifyData(hash: string, data: string): Promise<boolean> {
    return await argon2.verify(hash, data, {
      secret: Buffer.from(this.config.getOrThrow<string>('argon2.secret')),
    });
  }
}
