import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRole } from '@turborepo/dtos';
import type { IUser, ILoginResponse } from '@turborepo/dtos';

@Injectable()
export class AuthService {
  login(email: string): ILoginResponse {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Email is required');
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.includes('@')) {
      throw new BadRequestException('Invalid email format');
    }

    const localPart = trimmedEmail.split('@')[0];
    const role = localPart?.includes('admin') ? UserRole.ADMIN : UserRole.CLIENT;

    const user: IUser = {
      email: trimmedEmail,
      role,
    };

    const token = Buffer.from(JSON.stringify(user)).toString('base64');

    return {
      token,
      user,
    };
  }

  validateToken(token: string): IUser | null {
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
