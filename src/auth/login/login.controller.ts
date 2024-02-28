import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { CreateLoginDto, Token } from './Swagger';
import { PageService } from 'src/admin/pages/page.service';

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private pageService: PageService,
  ) {}

  // @BypassAuth()
  @Post('tfa')
  async TFA(@Body() body, @Req() req) {
    try {
      const userData = req.tokenData;
      const user = await this.loginService.getUserAuth({
        email: userData.email,
      });
      const validPin = await this.loginService.verifyPin(req.token, body.pin);
      if (!validPin) throw new Error('Pin inválido');
      const token = await this.loginService.generateToken(user);

      const userRoutes = await this.pageService.getAllPagesByUser(
        user.User.id,
        user.User.tenant_id,
      );
      console.log(user.User.Tenant)
      return { token, tenant_id: user.User.tenant_id,
        app_image: user.User.Tenant.app_image,
         tenant_image: user.User.Tenant.tenant_image, tenant_color: user.User.Tenant.tenant_color, user_email: user.User.contact_email, userRoutes };
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
        const userRoutes = await this.pageService.getAllPagesByUser(
          user_auth.User.id,
          user_auth.User.tenant_id,
        );
        return { token, userRoutes, pass: true };
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
   
  @Get('routes')
  async GetRoutes(@Req() req) {
    const userData = req.tokenData;
    const user = await this.loginService.getUserAuth({
      email: userData.contact_email,
    });
    const userRoutes = await this.pageService.getAllPagesByUser(user.User.id, user.User.tenant_id,);
    return { userRoutes };
  }
  @BypassAuth()
  @Get('app/image')
  async AppImage() {
    const tenant = await this.loginService.getPageImage()
    console.log(tenant)

    return  {app_image: tenant.app_image, tenant_image: tenant.tenant_image }
  }
  @BypassAuth()
  @Get('reset-pass/:email')
  async ResetPass(@Param('email') email) {
    try {
      await this.loginService.resetPass(email);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
  @BypassAuth()
  @Post('set-new-pass')
  async SetNewPass(@Body() payload) {
    try {
      await this.loginService.setNewPass(payload);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
