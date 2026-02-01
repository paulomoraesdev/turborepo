import type { ILoginRequest } from '@turborepo/dtos';

export class LoginDto implements ILoginRequest {
  email: string;
}
