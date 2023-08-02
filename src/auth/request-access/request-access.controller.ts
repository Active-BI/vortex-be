import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RequestAccessService } from './request-access.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request_admin_access } from '@prisma/client';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';

@ApiTags('Request-access')
@Controller('request-access')
export class RequestAccessController {
  constructor(private readonly requestAccessService: RequestAccessService) {}

  // endpoint para criar nova solicitação de autorização
  @BypassAuth()
  @Post()
  async createNewRequest(@Body() createAdminRequestDto: Request_admin_access) {
    return this.requestAccessService.create(createAdminRequestDto);
  }

  // endpoint para gerar link de cadastro
  @BypassAuth()
  @Get(':email')
  async requestEmailAuth(@Param('email') email: string) {
    return this.requestAccessService.createLinkToRequestAccess(email);
  }
}
