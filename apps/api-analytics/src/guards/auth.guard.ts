import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '@turborepo/dtos';
import type { IUser } from '@turborepo/dtos';

export interface RequestWithUser extends Request {
  user: IUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = this.validateToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = user;
    return true;
  }

  private validateToken(token: string): IUser | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const user = JSON.parse(decoded) as IUser;

      if (user.email && user.role && Object.values(UserRole).includes(user.role)) {
        return user;
      }
      return null;
    } catch {
      return null;
    }
  }
}
