import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase, NodePgTransaction } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/drizzle/schema';
import { eq } from 'drizzle-orm';
import {
  CreateProfileResponse,
  GetProfileIdResponse,
  GetProfileResponse,
  UpdateProfileResponse,
} from './types';
import { PhonesService } from '../phones/phones.service';
import { CreateProfile, UpdateProfile } from './dto';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('DATABASE_CONNCTION')
    private readonly db: NodePgDatabase<typeof schema>,
    @Inject(forwardRef(() => PhonesService))
    private readonly phoneService: PhonesService,
  ) {}
  private get Profiles() {
    return schema.profilesTable;
  }

  async getProfileId(user_id: string): Promise<GetProfileIdResponse> {
    try {
      const [profileUser] = await this.db
        .select({ profile_id: this.Profiles.profile_id })
        .from(this.Profiles)
        .where(eq(this.Profiles.user_id, user_id));

      if (!profileUser) {
        throw new NotFoundException('Profile not found for this user');
      }

      return {
        message: 'Profile ID returned successfully',
        ...profileUser,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpceted database error: ${error.message}`
          : 'Unexpceted database error',
      );
    }
  }
  async createProfile(
    dto: CreateProfile,
    tx?: NodePgTransaction<any, any>,
  ): Promise<CreateProfileResponse> {
    try {
      const filterDto = Object.fromEntries(
        Object.entries(dto).filter(([, value]) => value !== undefined),
      );
      if (Object.keys(filterDto).length === 0) {
        throw new BadRequestException('No fields provided for create profile');
      }
      const [profile] = await (tx || this.db)
        .insert(this.Profiles)
        .values(dto)
        .returning({ profile_id: this.Profiles.profile_id });
      if (!profile) {
        throw new NotFoundException('Profile not found for this user');
      }
      return {
        message: 'Profile created successfully',
        profile_id: profile.profile_id,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected Error : ${error.message}`
          : 'Unexpected error',
      );
    }
  }

  async getProfile(user_id: string): Promise<GetProfileResponse> {
    try {
      const profile = await this.getProfileId(user_id);
      const phonesResult = await this.phoneService.getUserPhones(
        profile.profile_id,
      );
      return {
        message: 'Profile and phones retrieved successfully',
        profile_id: profile.profile_id,
        phones: phonesResult.phones,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected Error : ${error.message}`
          : 'Unexpected error',
      );
    }
  }

  async updateprofile(
    user_id: string,
    dto: UpdateProfile,
  ): Promise<UpdateProfileResponse> {
    try {
      const filterDto = Object.fromEntries(
        Object.entries(dto).filter(([, value]) => value !== undefined),
      );
      if (Object.keys(filterDto).length === 0) {
        throw new BadRequestException('No fields provided for update');
      }
      const [profile] = await this.db
        .update(this.Profiles)
        .set(filterDto)
        .where(eq(this.Profiles.user_id, user_id))
        .returning({ profile_id: this.Profiles.profile_id });
      if (!profile) {
        throw new NotFoundException('Profile not found for this user');
      }
      return {
        message: 'Profile updated successfully',
        profile_id: profile.profile_id,
      };
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpected Error : ${error.message}`
          : 'Unexpected error',
      );
    }
  }
}
