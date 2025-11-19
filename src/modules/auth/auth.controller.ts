import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('local/signup')
  async localSignup() {}

  @Post('local/login')
  async localLogin() {}

  @Post('logout')
  async logout() {}

  @Post('refresh')
  async refresh() {}

  @Post('rest-password/request')
  async requestPassword() {}

  @Post('rest-password/confirm')
  async confirmPassword() {}
}
