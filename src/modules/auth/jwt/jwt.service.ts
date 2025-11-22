import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { JwtPayload } from './interface/jwt.payload';
import { TokenPair } from './interface/jwt.token';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  private get privateKey(): string {
    return this.config.getOrThrow('jwt.privateKey');
  }
  private get publicKey(): string {
    return this.config.getOrThrow('jwt.publicKey');
  }

  async generateTokens(payload: JwtPayload): Promise<TokenPair> {
    const access_token = await this.jwt.signAsync(payload, {
      privateKey: this.privateKey,
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
        publicKey: this.publicKey,
        algorithms: ['RS256'],
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async generateAccessToken(
    payload: JwtPayload,
  ): Promise<{ access_token: string }> {
    const access_token = await this.jwt.signAsync(payload, {
      privateKey: this.privateKey,
      algorithm: 'RS256',
      expiresIn: '15m',
    });

    return { access_token };
  }
}
