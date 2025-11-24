import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { Role, Roles } from 'src/common/decorator';
import { TokensService } from './tokens.service';
import { RevokeTokenResponse } from './types';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokenService: TokensService) {}
  @Roles(Role.ADMIN)
  @Patch(':user_id/revoke')
  async revokeToken(
    @Param('user_id', new ParseUUIDPipe()) user_id: string,
  ): Promise<RevokeTokenResponse> {
    return this.tokenService.revokeToken(user_id);
  }
}
