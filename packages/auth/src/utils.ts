import { UserRole } from '@turborepo/dtos';
import type { IUser, IOrder } from '@turborepo/dtos';
import { getToken } from './storage.js';

export function decodeToken(token: string): IUser | null {
  try {
    const decoded = atob(token);
    const user = JSON.parse(decoded) as IUser;
    if (user.email && user.role) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
}

export function encodeToken(user: IUser): string {
  return btoa(JSON.stringify(user));
}

export function getCurrentUser(): IUser | null {
  const token = getToken();
  if (!token) {
    return null;
  }
  return decodeToken(token);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function isAdmin(user: IUser): boolean {
  return user.role === UserRole.ADMIN;
}

export function isCurrentUserAdmin(): boolean {
  const user = getCurrentUser();
  return user !== null && isAdmin(user);
}

export function canAccessOrder(user: IUser, order: IOrder): boolean {
  if (isAdmin(user)) {
    return true;
  }
  return order.assigned_to === user.email || order.assigned_to === null;
}

export function canModifyOrder(user: IUser, order: IOrder): boolean {
  if (isAdmin(user)) {
    return true;
  }
  return order.assigned_to === user.email || order.assigned_to === null;
}

export function canDeleteOrder(user: IUser): boolean {
  return isAdmin(user);
}

export function canCreateOrder(user: IUser): boolean {
  return isAdmin(user);
}

export function canAssignOrderTo(user: IUser, targetEmail: string): boolean {
  if (isAdmin(user)) {
    return true;
  }
  return targetEmail === user.email;
}
