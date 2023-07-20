import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';

export class CreateLoginDto {
  email: string;
  password: string;
}

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @BypassAuth()
  @Post()
  async Login(@Body() body: CreateLoginDto) {
    try {
      const token = await this.loginService.checkPass(body);
      return token;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
  @BypassAuth()
  @Post('register')
  async Register(@Body() body: CreateLoginDto) {
    try {
      const token = await this.loginService.register(body);
      return token;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
