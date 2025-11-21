import { Body, Controller, ParseUUIDPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LocalLoginResponse,
  LocalSignupResponse,
  LogoutResponse,
} from './types';
import { LocalLoginDto, LocalSignupDto } from './dto';
import { Public, User } from 'src/common/decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('local/signup')
  async localSignup(@Body() dto: LocalSignupDto): Promise<LocalSignupResponse> {
    return this.authService.localSignup(dto);
  }

  @Public()
  @Post('local/login')
  async localLogin(@Body() dto: LocalLoginDto): Promise<LocalLoginResponse> {
    return this.authService.localLogin(dto);
  }

  @Post('logout')
  async logout(
    @User('user_id', new ParseUUIDPipe()) user_id: string,
  ): Promise<LogoutResponse> {
    return this.authService.logout(user_id);
  }

  @Post('refresh')
  async refresh() {}

  @Public()
  @Post('rest-password/request')
  async requestPassword() {}

  @Public()
  @Post('rest-password/confirm')
  async confirmPassword() {}
}
