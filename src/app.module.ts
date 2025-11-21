import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import {
  argon2Config,
  cloudinaryConfig,
  databaseConfig,
  jwtConfig,
} from './config/configuration';
import { validateEnv } from './config/environment';
import { AuthModule } from './modules/auth/auth.module';
import { UploadController } from './modules/upload/upload.controller';
import { RolesModule } from './modules/roles/roles.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { AuthJwtModule } from './modules/auth/jwt/jwt.module';
import { JwtAuthGuard } from './common/guard';
import { JwtAuthMiddleware } from './common/middleware';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [databaseConfig, cloudinaryConfig, argon2Config, jwtConfig],
      validate: validateEnv,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
    }),
    DatabaseModule,
    AuthModule,
    RolesModule,
    TokensModule,
    AuthJwtModule,
  ],
  controllers: [UploadController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        { path: '/auth/local/signup', method: RequestMethod.POST },
        { path: '/auth/local/login', method: RequestMethod.POST },
        { path: '/auth/rest-password/request', method: RequestMethod.POST },
        { path: '/auth/rest-password/confirm', method: RequestMethod.POST },
        { path: '/roles', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
