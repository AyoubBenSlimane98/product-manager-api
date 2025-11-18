import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { JwtPayload } from './interface/jwt.payload';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async generateTokens(payload: JwtPayload) {
    const access_token = await this.jwt.signAsync(payload, {
      privateKey: this.config.getOrThrow('jwt.privateKey'),
      algorithm: 'RS256',
      expiresIn: '15m',
    });
    const refresh_token = crypto.randomBytes(64).toString('hex');
    return {
      access_token,
      refresh_token,
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwt.verifyAsync(token, {
        publicKey: this.config.getOrThrow('jwt.publicKey'),
        algorithms: ['RS256'],
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async generateAccessToken(payload: JwtPayload) {
    const access_token = await this.jwt.signAsync(payload, {
      privateKey: this.config.getOrThrow('jwt.privateKey'),
      algorithm: 'RS256',
      expiresIn: '15m',
    });

    return { access_token };
  }
}
