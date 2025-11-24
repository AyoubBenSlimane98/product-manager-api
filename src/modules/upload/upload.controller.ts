import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import multer from 'multer';
import { Role, Roles } from 'src/common/decorator';

import { UploadService } from './upload.service';
@Roles(Role.PRODUCT_MANAGER, Role.ADMIN)
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
    this.uploadService.validateFile(file);
    return await this.uploadService.uploadImage(file);
  }
}
