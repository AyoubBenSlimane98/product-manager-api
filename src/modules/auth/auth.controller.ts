import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalSignupResponse } from './types';
import { LocalSignupDto } from './dto';
import { Public } from 'src/common/decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Get()
  hello() {
    return 'Hello ';
  }
  @Public()
  @Post('local/signup')
  async localSignup(@Body() dto: LocalSignupDto): Promise<LocalSignupResponse> {
    return this.authService.localSignup(dto);
  }

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
