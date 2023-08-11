import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { DashboardsMasterService } from './dashboards.service';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { DashboardService } from 'src/admin/dashboard/dashboard.service';

@Controller('master/dashboards')
export class DashboardsMasterController {
  constructor(
    private readonly dashboardsService: DashboardsMasterService,
    private dashboardAdminService: DashboardService,
  ) {}

  @Get('/:tenant_id')
  @Roles('Master')
  async findAllByTenant(@Param('tenant_id') tenant_id) {
    return await this.dashboardsService.findAllByTenant(tenant_id);
  }
  @Get('user/:tenant_id')
  @Roles('Master')
  async findAllByTenantAndUser(@Param('tenant_id') tenant_id) {
    return await this.dashboardsService.findAllByTenantAndUser(tenant_id);
  }

  @Get('')
  @Roles('Master')
  async findAll() {
    return await this.dashboardsService.findAll();
  }

  @Roles('Master')
  @Post('/:userid')
  async setDashboardUser(@Req() req, @Body() body, @Param('userid') userid) {
    const { DashboardUserList, tenant_id } = body;
    const getTenantDashBoards =
      await this.dashboardsService.findAllTenantDashboard(
        tenant_id,
        DashboardUserList,
      );
    await this.dashboardAdminService.setDashboardUser(
      getTenantDashBoards,
      userid,
      tenant_id,
    );
  }
}
