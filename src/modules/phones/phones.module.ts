import { forwardRef, Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { PhonesController } from './phones.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [forwardRef(() => ProfilesModule)],
  controllers: [PhonesController],
  providers: [PhonesService],
  exports: [PhonesService],
})
export class PhonesModule {}
