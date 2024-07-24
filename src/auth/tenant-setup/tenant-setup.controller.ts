import { Controller, Get, Req } from '@nestjs/common';
import { TenantSetupService } from './tenant-setup.service';
import { ApiResponse } from '@nestjs/swagger';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { AppImageResponse } from '../login/Swagger';

@Controller('app-setup')
export class TenantSetupController {
  constructor(private readonly tenantSetupService: TenantSetupService) {}

  @BypassAuth()
  @ApiResponse({ type: AppImageResponse })
  @Get('layout')
  async AppImage() {
    return await this.tenantSetupService.getPageImage();
  }

  @Get('tenant-layout')
  async GetAppConfig(@Req() req) {
    const tenantId = req.tokenData.tenant_id;
    return await this.tenantSetupService.getTenantConfig(tenantId);
  }


  @BypassAuth()
  @Get('routes')
  async getUserRoutes(@Req() req) {
    const tenantId = req.tokenData.tenant_id;
    const userId = req.tokenData.userId;
    return await this.tenantSetupService.getUserRoutes(userId, tenantId);
  }
}
