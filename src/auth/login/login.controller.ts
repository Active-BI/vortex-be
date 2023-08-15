import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { CreateLoginDto, Token } from './Swagger';

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // @BypassAuth()
  @Post('tfa')
  async TFA(@Body() body, @Req() req) {
    try {
      const userData = req.tokenData;
      const user = await this.loginService.getUserAuth({
        email: userData.email,
      });
      const validPin = await this.loginService.verifyPin(body.token, body.pin);
      if (!validPin) throw new Error('Pin inválido');
      const token = await this.loginService.generateToken(user);
      return { token };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @BypassAuth()
  @Post()
  @ApiResponse({ type: Token })
  @ApiBody({ type: CreateLoginDto })
  async Login(@Body() body: CreateLoginDto) {
    try {
      const user_auth = await this.loginService.getUserAuth(body);
      if (user_auth.User.Rls.name === 'Master') {
        const token = await this.loginService.checkPassMaster(body);
        return { token, pass: true };
      }
      const token = await this.loginService.TFA(body);

      return { token };
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
