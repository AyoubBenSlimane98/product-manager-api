import { forwardRef, Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PhonesModule } from '../phones/phones.module';

@Module({
  imports: [forwardRef(() => PhonesModule)],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
