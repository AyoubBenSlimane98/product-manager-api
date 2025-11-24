import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Role, ROLES_KEY } from '../decorator';

export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { user_id: string; roles?: Role[] } }>();
    const { user } = request;
    if (!user) throw new ForbiddenException('User not authenticated');
    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!hasRole) throw new ForbiddenException('You do not have permission');
    return true;
  }
}
