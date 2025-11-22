import { Body, Controller, ParseUUIDPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmPasswordResponse,
  LocalLoginResponse,
  LocalSignupResponse,
  LogoutResponse,
  ReqPasswordResponse,
} from './types';
import {
  ConfirmPasswordDto,
  LocalLoginDto,
  LocalSignupDto,
  RefreshTokenDto,
  ReqPasswordDto,
} from './dto';
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
  async refresh(
    @User() user: { user_id: string; roles: string[] },
    @Body() dto: RefreshTokenDto,
  ) {
    return this.authService.refresh(user, dto);
  }

  @Public()
  @Post('rest-password')
  async requestPassword(
    @Body() dto: ReqPasswordDto,
  ): Promise<ReqPasswordResponse> {
    return this.authService.requestPassword(dto);
  }

  @Public()
  @Post('rest-password/confirm')
  async confirmPassword(
    @Body() dto: ConfirmPasswordDto,
  ): Promise<ConfirmPasswordResponse> {
    return this.authService.confirmPassword(dto);
  }
}
