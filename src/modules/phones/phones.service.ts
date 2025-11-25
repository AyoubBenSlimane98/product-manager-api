import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/drizzle/schema';
import { and, eq, ne } from 'drizzle-orm';
import {
  CreatePhonesResponse,
  GetUserPhonesResponse,
  DeletePhoneResponse,
  UpdatePhoneResponse,
} from './types';
import { CreatePhonesDto, UpdatePhoneDto } from './dto';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class PhonesService {
  constructor(
    @Inject('DATABASE_CONNCTION')
    private readonly db: NodePgDatabase<typeof schema>,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
  ) {}
  private get Phones() {
    return schema.phonesTable;
  }
  async getUserPhones(profile_id: string): Promise<GetUserPhonesResponse> {
    try {
      const result = await this.db
        .select()
        .from(this.Phones)
        .where(eq(this.Phones.profile_id, profile_id));
      return {
        message: 'All phone numbers of user',
        phones: result,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpceted database error: ${error.message}`
          : 'Unexpceted database error',
      );
    }
  }

  async createUserPhones(
    user_id: string,
    dto: CreatePhonesDto,
  ): Promise<CreatePhonesResponse> {
    const { phones } = dto;
    try {
      if (phones.length === 0) {
        throw new BadRequestException('phones array cannot be empty');
      }
      const primaryCount = phones.filter((p) => p.is_primary).length;
      if (primaryCount > 1) {
        throw new BadRequestException('only one primary phone is allwoed');
      }
      const profile = await this.profilesService.getProfileId(user_id);
      if (!profile) {
        throw new NotFoundException('Profile not found for this user');
      }
      return await this.db.transaction(async (tx) => {
        const result = await tx
          .insert(this.Phones)
          .values(phones.map((p) => ({ ...p, profile_id: profile.profile_id })))
          .returning({
            phone_id: this.Phones.phone_id,
            country_code: this.Phones.country_code,
            phone_number: this.Phones.phone_number,
          });
        return {
          message: 'User phones saved successfully ',
          phones: result,
        };
      });
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error
          ? `Unexpceted database error: ${error.message}`
          : 'Unexpceted database error',
      );
    }
  }

  async updatePhoneUser(
    phone_id: string,
    dto: UpdatePhoneDto,
  ): Promise<UpdatePhoneResponse> {
    const filterDto = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );
    if (Object.keys(filterDto).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }
    const [phone] = await this.db
      .select()
      .from(this.Phones)
      .where(eq(this.Phones.phone_id, phone_id))
      .limit(1);

    if (!phone) {
      throw new NotFoundException('Phone does not exist');
    }
    const [updatedPhone] = await this.db
      .update(this.Phones)
      .set(filterDto)
      .where(eq(this.Phones.phone_id, phone_id))
      .returning({
        phone_id: this.Phones.phone_id,
        country_code: this.Phones.country_code,
        phone_number: this.Phones.phone_number,
      });

    return {
      message: 'Phone updated successfully',
      phone: updatedPhone,
    };
  }

  async deletePhone(phone_id: string): Promise<DeletePhoneResponse> {
    return this.db.transaction(async (tx) => {
      const [phone] = await tx
        .select({
          profile_id: this.Phones.profile_id,
          is_primary: this.Phones.is_primary,
        })
        .from(this.Phones)
        .where(eq(this.Phones.phone_id, phone_id));

      if (!phone) {
        throw new NotFoundException('Phone number does not exist');
      }

      if (phone.is_primary) {
        const [replacement] = await tx
          .select({
            phone_id: this.Phones.phone_id,
          })
          .from(this.Phones)
          .where(
            and(
              eq(this.Phones.profile_id, phone.profile_id),
              ne(this.Phones.phone_id, phone_id),
            ),
          )
          .limit(1);

        if (!replacement) {
          throw new BadRequestException(
            'Add another phone number before deleting the primary one',
          );
        }

        await tx
          .update(this.Phones)
          .set({ is_primary: true })
          .where(eq(this.Phones.phone_id, replacement.phone_id));
      }

      await tx.delete(this.Phones).where(eq(this.Phones.phone_id, phone_id));

      return { message: 'Phone deleted successfully' };
    });
  }
}
