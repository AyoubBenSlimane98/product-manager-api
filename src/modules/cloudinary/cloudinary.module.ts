import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as Cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

export const CLOUDINARY = 'cloudinary';

@Global()
@Module({
  providers: [
    {
      provide: CLOUDINARY,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        Cloudinary.config({
          cloud_name: config.get('cloudinary.cloud_name'),
          api_key: config.get('cloudinary.api_key'),
          api_secret: config.get('cloudinary.api_secret'),
          secure: true,
        });
        return Cloudinary;
      },
    },
    CloudinaryService,
  ],
  exports: [CLOUDINARY, CloudinaryService],
})
export class CloudinaryModule {}
