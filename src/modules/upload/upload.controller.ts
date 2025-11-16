import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { UploadService } from './upload.service';
import multer from 'multer';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: multer.memoryStorage(),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.time('upload');
    this.uploadService.validateFile(file);
    const result = await this.uploadService.uploadImage(file);
    console.timeEnd('upload');
    return result;
  }
}
