import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import multer from 'multer';
import { Public } from 'src/common/decorator';
import { LazyModuleLoader, ModuleRef } from '@nestjs/core';

@Controller('upload')
export class UploadController {
  private uploadModuleRef: ModuleRef;
  constructor(private readonly lazyModuleLoader: LazyModuleLoader) {}
  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: multer.memoryStorage(),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.time('Upload');
    if (!this.uploadModuleRef) {
      const { UploadModule } = await import('./upload.module.js');
      this.uploadModuleRef = await this.lazyModuleLoader.load(
        () => UploadModule,
      );
    }
    const { UploadService } = await import('./upload.service.js');
    const uploadService = this.uploadModuleRef.get(UploadService, {
      strict: false,
    });

    uploadService.validateFile(file);
    const result = await uploadService.uploadImage(file);
    console.timeEnd('Upload');
    return result;
  }
}
