import { SetMetadata } from '@nestjs/common';
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PRODUCT_MANAGER = 'PRODUCT-MANAGER',
}
export const ROLES_KEY = 'roles_key';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
