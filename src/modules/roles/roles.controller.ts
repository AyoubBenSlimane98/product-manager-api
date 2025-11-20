import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AssignRoleDto, CreateRoleDto, UpdateRoleDto } from './dto';
import {
  CreateRoleReponse,
  AssignRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
  AllRolesResponse,
  GetRoleResponse,
} from './types';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getAllRoles(): Promise<AllRolesResponse> {
    return this.rolesService.getAllRoles();
  }

  @Get()
  async getRole(@Query('name') name: string): Promise<GetRoleResponse> {
    return this.rolesService.getRole(name);
  }

  @Post()
  async createRole(@Body() dto: CreateRoleDto): Promise<CreateRoleReponse> {
    return this.rolesService.createRole(dto);
  }

  @Post('assign')
  async assignRole(@Body() dto: AssignRoleDto): Promise<AssignRoleResponse> {
    return this.rolesService.assignRole(dto);
  }

  @Patch(':role_id')
  async updateRole(
    @Param('role_id', new ParseUUIDPipe()) role_id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<UpdateRoleResponse> {
    return this.rolesService.updateRole(role_id, dto);
  }

  @Delete(':role_id')
  async deleteRole(
    @Param('role_id', new ParseUUIDPipe()) role_id: string,
  ): Promise<DeleteRoleResponse> {
    return this.rolesService.deleteRole(role_id);
  }
}
