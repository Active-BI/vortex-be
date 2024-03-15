import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RequestAccessService } from './request-access.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { RequestAdminAccess, Token } from './Swagger';

@ApiTags('Request-access')
@Controller('request-access')
export class RequestAccessController {
  constructor(private readonly requestAccessService: RequestAccessService) {}

  // // endpoint para criar nova solicitação de autorização recebendo Token
  // @Get(':token')
  // @ApiBody({
  //   type: RequestAdminAccess,
  // })
  // @ApiResponse({
  //   type: RequestAdminAccess,
  // })
  // @BypassAuth()
  // async createNewRequest(@Param('token') token: string) {
  //   return this.requestAccessService.create(token);
  // }

  // // endpoint enviar confirmação de nova solicitação por email
  // @BypassAuth()
  // @Post()
  // @ApiBody({
  //   type: RequestAdminAccess,
  // })
  // @ApiResponse({
  //   type: RequestAdminAccess,
  // })
  // async confirmNewRequest(@Body() createAdminRequestDto: Request_admin_access) {
  //   return this.requestAccessService.createLinkToConfirmRequestAccess(
  //     createAdminRequestDto,
  //   );
  // }
}
