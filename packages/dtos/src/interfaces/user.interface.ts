import type { UserRole } from "../enums/user-role.enum";

export interface IUser {
  email: string;
  role: UserRole;
}
