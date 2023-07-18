import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get()
  async getAllDashboards(@Req() req) {
    const { tenant_id } = req.tokenData;
    return await this.dashboardService.getAllDashboards(tenant_id);
  }

  @Post()
  setDashboardUser(@Req() req, @Body() body) {
    const { DashboardUserList } = body;
    console.log(DashboardUserList);
    const { tenant_id, userId } = req.tokenData;
    this.dashboardService.setDashboardUser(
      DashboardUserList,
      userId,
      tenant_id,
    );
  }
}
