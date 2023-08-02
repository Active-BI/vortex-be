import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RequestAccessService } from './request-access.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request_admin_access } from '@prisma/client';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { RequestAdminAccess, Token } from './Swagger';

@ApiTags('Request-access')
@Controller('request-access')
export class RequestAccessController {
  constructor(private readonly requestAccessService: RequestAccessService) {}

  // endpoint para criar nova solicitação de autorização
  @BypassAuth()
  @Post()
  @ApiBody({
    type: RequestAdminAccess,
  })
  @ApiResponse({
    type: RequestAdminAccess,
  })
  async createNewRequest(@Body() createAdminRequestDto: Request_admin_access) {
    return this.requestAccessService.create(createAdminRequestDto);
  }

  // endpoint para gerar link de cadastro
  // @BypassAuth()
  // @Get(':email')
  // @ApiResponse({
  //   type: Token,
  // })
  // async requestEmailAuth(@Param('email') email: string) {
  //   return this.requestAccessService.createLinkToRequestAccess(email);
  // }
}
