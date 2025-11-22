export type Role = 'ADMIN' | 'USER' | 'PRODUCT-MANAGER';

export interface JwtPayload {
  user_id: string;
  roles?: string[];
}
