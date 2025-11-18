import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import {
  argon2Config,
  cloudinaryConfig,
  databaseConfig,
  jwtConfig,
} from './config/configuration';
import { validateEnv } from './config/environment';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';

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
    UploadModule,
    AuthModule,
  ],
})
export class AppModule {}
