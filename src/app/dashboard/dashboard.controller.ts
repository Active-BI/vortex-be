import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get()
  getAllDashboards(@Req() req) {
    const { tenant_id } = req.tokenData;
    this.dashboardService.getAllDashboards(tenant_id);
  }

  @Post()
  setDashboardUser(@Req() req, @Body() body) {
    const { DashboardUserList, user_id } = body;
    const { tenant_id } = req.tokenData;
    this.dashboardService.setDashboardUser(
      DashboardUserList,
      user_id,
      tenant_id,
    );
  }
}
