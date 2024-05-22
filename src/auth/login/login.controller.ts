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
import {
  AppImageResponse,
  RoutesResponse,
  TfaResponse,
  Token,
  UserRoute,
} from './Swagger';
import { PageService } from 'src/admin/pages/page.service';
import { CreateLoginDto } from './DTOs/CreateLoginDto';
import { TfaDto } from './DTOs/TfaDto';

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private pageService: PageService,
  ) {}

  // @BypassAuth()
  @Post('tfa')
  @ApiResponse({ type: TfaResponse })
  @ApiBody({ type: TfaDto })
  async TFA(@Body() body: TfaDto, @Req() req) {
    const { tokenData, token } = req;
    await this.loginService.verifyTFA(tokenData, token, body);
    // try {
    //   const userData = req.tokenData;
    //   const user = await this.loginService.getUserAuth({
    //     email: userData.email,
    //   });
    //   const validPin = await this.loginService.verifyPin(req.token, body.pin);
    //   if (!validPin) throw new Error('Pin inválido');
    //   const token = await this.loginService.generateToken(user);

    //   const userRoutes = await this.pageService.getAllPagesByUser(
    //     user.User.id,
    //     user.User.tenant_id,
    //   );
    //   return {
    //     token,
    //     tenant_id: user.User.tenant_id,
    //     app_image: user.User.Tenant.tenant_image,
    //     tenant_image: user.User.Tenant.tenant_image,
    //     tenant_color: user.User.Tenant.tenant_color,
    //     user_email: user.User.contact_email,
    //     userRoutes,
    //   };
    // } catch (e) {
    //   throw new BadRequestException(e.message);
    // }
  }

  @BypassAuth()
  @Post()
  @ApiResponse({ type: Token })
  @ApiBody({ type: CreateLoginDto })
  async Login(@Body() body: CreateLoginDto) {
    await this.loginService.login(body);
    // try {
    //   const user_auth = await this.loginService.getUserAuth(body);
    //   if (user_auth.User.Rls.name === 'Master') {
    //     const token = await this.loginService.checkPassMaster(body);
    //     const userRoutes = await this.pageService.getAllPagesByUser(
    //       user_auth.User.id,
    //       user_auth.User.tenant_id,
    //     );
    //     return { token, userRoutes, pass: true };
    //   }
    //   const token = await this.loginService.TFA(body);

    //   return { token };
    // } catch (e) {
    //   throw new UnauthorizedException(e.message);
    // }
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
  @ApiResponse({ type: RoutesResponse })
  async GetRoutes(@Req() req) {
    const userData = req.tokenData;
    const user = await this.loginService.getUserAuth({
      email: userData.contact_email,
    });
    const userRoutes = await this.pageService.getAllPagesByUser(
      user.User.id,
      user.User.tenant_id,
    );
    return { userRoutes };
  }

  @BypassAuth()
  @ApiResponse({ type: AppImageResponse })
  @Get('app/image')
  async AppImage() {
    const app = await this.loginService.getPageImage();
    return {
      app_image: app.bg_image,
      tenant_image: app.logo,
      bg_color: app.bg_color,
    };
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
