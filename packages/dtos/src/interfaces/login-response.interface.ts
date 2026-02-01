import type { IUser } from "./user.interface";

export interface ILoginRequest {
  email: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}
