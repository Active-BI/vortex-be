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
import { TfaService } from '../auth_service/tfa.service';
import { SetNewPassDto } from './DTOs/SetNewPassDto';

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private pageService: PageService,
    private tfaService: TfaService,
  ) {}

  @Post('tfa')
  @BypassAuth()
  @ApiResponse({ type: TfaResponse })
  @ApiBody({ type: TfaDto })
  async TFA(@Body() body: TfaDto, @Req() req) {
    const {
      tokenData: { email },
      token,
    } = req;
    const { pin } = body;
    return await this.tfaService.loginTFA(email, token, pin);
  }

  @BypassAuth()
  @Post()
  @ApiResponse({ type: Token })
  @ApiBody({ type: CreateLoginDto })
  async Login(@Body() body: CreateLoginDto) {
    return await this.loginService.login(body);
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
  @ApiBody({type: SetNewPassDto})
  async SetNewPass(@Body() payload: SetNewPassDto) {
    try {
      await this.loginService.setNewPass(payload);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }


}
