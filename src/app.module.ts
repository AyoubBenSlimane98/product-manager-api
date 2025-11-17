import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import {
  argon2Config,
  cloudinaryConfig,
  databaseConfig,
} from './config/configuration';
import { validateEnv } from './config/environment';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { Argon2Module } from './modules/auth/argon2/argon2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [databaseConfig, cloudinaryConfig, argon2Config],
      validate: validateEnv,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
    }),
    DatabaseModule,
    CloudinaryModule,
    UploadModule,
    AuthModule,
    Argon2Module,
  ],
})
export class AppModule {}
