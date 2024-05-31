import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BypassAuth } from './helpers/strategy/jwtGuard.service';
import { ApiResponse } from '@nestjs/swagger';
import { AppImageResponse } from './auth/login/Swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @BypassAuth()
  @ApiResponse({ type: AppImageResponse })
  @Get('app/image')
  async AppImage() {
    const app = await this.appService.getPageImage();
    return {
      app_image: app.bg_image,
      tenant_image: app.logo,
      bg_color: app.bg_color,
    };
  }
}
