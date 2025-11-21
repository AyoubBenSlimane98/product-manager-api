import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    type RequestWithUser = Request & { user?: Record<string, unknown> };
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!data) {
      return user;
    }
    if (user && typeof user === 'object' && data in user) {
      return user[data];
    }
    return undefined;
  },
);
