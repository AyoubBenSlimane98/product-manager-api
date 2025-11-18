import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Argon2Module } from './argon2/argon2.module';
import { AuthJwtModule } from './jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        publicKey: config.getOrThrow<string>('jwt.publicKey'),
        privateKey: config.getOrThrow<string>('jwt.privateKey'),
        signOptions: { algorithm: 'RS256' },
        verifyOptions: { algorithms: ['RS256'] },
      }),
    }),
    AuthJwtModule,
    Argon2Module,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
