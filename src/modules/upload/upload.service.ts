import { BadRequestException, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import sharp from 'sharp';
@Injectable()
export class UploadService {
  constructor(private readonly cloud: CloudinaryService) {}
  allowedExt = ['.png', '.jpg', '.jpeg', '.webp'];
  allowedMime = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

  validateFile(file: Express.Multer.File): boolean {
    if (!file) throw new BadRequestException('No file uploaded');

    const fileExt = extname(file.originalname).toLowerCase();
    if (!this.allowedExt.includes(fileExt))
      throw new BadRequestException('Invalid extension');

    if (!this.allowedMime.includes(file.mimetype))
      throw new BadRequestException('Invalid MIME type');

    if (file.originalname.includes('..'))
      throw new BadRequestException('Invalid filename');

    if (file.originalname.length > 150)
      throw new BadRequestException('Filename too long');

    return true;
  }
  async uploadImage(file: Express.Multer.File) {
    const compressed = await sharp(file.buffer)
      .jpeg({ quality: 70 })
      .toBuffer();
    return await this.cloud.uploadBuffer(compressed);
  }
}
