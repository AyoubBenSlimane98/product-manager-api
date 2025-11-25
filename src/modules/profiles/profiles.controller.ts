import { Controller, Get, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { GetProfileResponse, UpdateProfileResponse } from './types';
import { User } from 'src/common/decorator';
import { UpdateProfile } from './dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async getProfile(
    @User('user_id', new ParseUUIDPipe()) user_id: string,
  ): Promise<GetProfileResponse> {
    return this.profilesService.getProfile(user_id);
  }

  @Patch()
  async updateprofil(
    @User('user_id', new ParseUUIDPipe()) user_id: string,
    dto: UpdateProfile,
  ): Promise<UpdateProfileResponse> {
    return this.profilesService.updateprofile(user_id, dto);
  }
}
