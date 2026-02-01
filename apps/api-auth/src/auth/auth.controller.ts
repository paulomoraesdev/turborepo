import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import type { ILoginResponse, IUser } from '@turborepo/dtos';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): ILoginResponse {
    return this.authService.login(loginDto.email);
  }

  @Get('me')
  me(@Headers('authorization') authHeader: string): IUser {
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = this.authService.validateToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  @Get('validate')
  validate(@Headers('authorization') authHeader: string): { valid: boolean; user?: IUser } {
    if (!authHeader) {
      return { valid: false };
    }

    const token = authHeader.replace('Bearer ', '');
    const user = this.authService.validateToken(token);

    if (!user) {
      return { valid: false };
    }

    return { valid: true, user };
  }
}
