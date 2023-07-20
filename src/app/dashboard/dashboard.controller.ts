import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get()
  async getAllDashboards(@Req() req) {
    const { tenant_id } = req.tokenData;
    return await this.dashboardService.getAllDashboards(tenant_id);
  }
  @Get('/byuser')
  async getAllDashboardsByUser(@Req() req) {
    const { userId, tenant_id } = req.tokenData;
    return await this.dashboardService.getAllDashboardsByUser(
      userId,
      tenant_id,
    );
  }
  @Post('/:userid')
  async setDashboardUser(@Req() req, @Body() body, @Param('userid') userid) {
    const { DashboardUserList } = body;
    const { tenant_id } = req.tokenData;
    await this.dashboardService.setDashboardUser(
      DashboardUserList,
      userid,
      tenant_id,
    );
  }
}
