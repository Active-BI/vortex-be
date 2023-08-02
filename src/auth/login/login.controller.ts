import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { CreateLoginDto, Token } from './Swagger';

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @BypassAuth()
  @Post()
  @ApiResponse({ type: Token })
  @ApiBody({ type: CreateLoginDto })
  async Login(@Body() body: CreateLoginDto) {
    try {
      const user_auth = await this.loginService.getUserAuth(body);
      if (user_auth.User.Rls.name === 'Master') {
        const token = await this.loginService.checkPassMaster(body);
        return token;
      }
      const token = await this.loginService.checkPass(body);
      return token;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  @BypassAuth()
  @Post('register')
  @ApiBody({ type: CreateLoginDto })
  async Register(@Body() body: CreateLoginDto) {
    try {
      const token = await this.loginService.register(body);
      return token;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
