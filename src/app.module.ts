import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [databaseConfig],
      expandVariables: true,
      envFilePath: ['.env.development.local'],
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
