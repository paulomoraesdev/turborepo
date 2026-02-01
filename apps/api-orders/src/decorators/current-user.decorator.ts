import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { IUser } from '@turborepo/dtos';
import type { RequestWithUser } from '../guards/auth.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
