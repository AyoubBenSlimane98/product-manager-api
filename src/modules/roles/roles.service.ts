import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AssignRoleDto, CreateRoleDto, UpdateRoleDto } from './dto';
import {
  AllRolesResponse,
  AssignRoleResponse,
  CreateRoleReponse,
  DeleteRoleResponse,
  GetRoleResponse,
  UpdateRoleResponse,
} from './types';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/drizzle/schema';
import { eq } from 'drizzle-orm';
import { DatabaseError } from 'pg';

@Injectable()
export class RolesService {
  constructor(
    @Inject('DATABASE_CONNCTION') private readonly db: NodePgDatabase,
  ) {}
  private get Roles() {
    return schema.rolesTable;
  }
  private get UsersToRoles() {
    return schema.usersToRolesTable;
  }
  async getAllRoles(): Promise<AllRolesResponse> {
    try {
      const allRoles = await this.db
        .select({
          role_id: this.Roles.role_id,
          name: this.Roles.name,
          description: this.Roles.description,
        })
        .from(this.Roles);
      return {
        message: 'All roles return successsfully',
        roles: allRoles,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
  async getRole(name: string): Promise<GetRoleResponse> {
    try {
      const [role] = await this.db
        .select({ role_id: this.Roles.role_id, name: this.Roles.name })
        .from(this.Roles)
        .where(eq(this.Roles.name, name.toUpperCase()));
      if (!role) {
        throw new NotFoundException(`Role with name "${name}" does not exist`);
      }
      return {
        message: 'Role retrieved successfully',
        role,
      };
    } catch (error) {
      console.error('Error in getRole:', error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
  async createRole(dto: CreateRoleDto): Promise<CreateRoleReponse> {
    const { name, description } = dto;

    try {
      const [role] = await this.db
        .insert(this.Roles)
        .values({ name, description })
        .returning({
          role_id: this.Roles.role_id,
          name: this.Roles.name,
          created_at: this.Roles.created_at,
        });
      return {
        message: 'Role created successfully',
        role,
      };
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ConflictException('Role already exists.');
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async assignRole(dto: AssignRoleDto): Promise<AssignRoleResponse> {
    const { user_id, role_id } = dto;
    try {
      await this.db.insert(this.UsersToRoles).values({ user_id, role_id });
      return {
        message: 'Role assigned successfully',
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === '23505') {
          throw new ConflictException('Role already assigned to this user');
        }
        if (error.code === '23503') {
          throw new NotFoundException('User or Role does not exist.');
        }
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async updateRole(
    role_id: string,
    dto: UpdateRoleDto,
  ): Promise<UpdateRoleResponse> {
    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined),
    );
    try {
      const [updated] = await this.db
        .update(this.Roles)
        .set(updateData)
        .where(eq(this.Roles.role_id, role_id))
        .returning({
          role_id: this.Roles.role_id,
          name: this.Roles.name,
          description: this.Roles.description,
          updated_at: this.Roles.updated_at,
        });
      if (!updateData) {
        throw new NotFoundException('Role does not exsit.');
      }
      return {
        message: 'Role is updated successfully',
        role: updated,
      };
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ConflictException('Role name already exsits.');
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async deleteRole(role_id: string): Promise<DeleteRoleResponse> {
    try {
      const [deleted] = await this.db
        .delete(this.Roles)
        .where(eq(this.Roles.role_id, role_id))
        .returning({
          role_id: this.Roles.role_id,
          name: this.Roles.name,
          created_at: this.Roles.created_at,
        });
      if (!deleted) {
        throw new NotFoundException('Role does not exist');
      }
      return {
        message: 'Role deleted successfully',
        role: deleted,
      };
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23503') {
        throw new ConflictException(
          'Cannot detelte role because it is assigned to one or more users',
        );
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
