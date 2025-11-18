import { Inject, Injectable } from '@nestjs/common';
import { v2 as CloudinaryType, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof CloudinaryType,
  ) {}
  async uploadBuffer(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = this.cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          access_mode: 'authenticated',
          resource_type: 'image',
        },
        (err, result) => {
          if (err) return reject(new Error(err.message));
          if (!result) return reject(new Error('No upload result'));
          resolve(result);
        },
      );

      Readable.from(buffer).pipe(upload);
    });
  }
}
