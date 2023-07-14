import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';

export class CreateLoginDto {
  email: string;
  password: string;
}

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @Post()
  async Login(@Body() body: CreateLoginDto) {
    try {
      const token = await this.loginService.checkPass(body);
      return token;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
