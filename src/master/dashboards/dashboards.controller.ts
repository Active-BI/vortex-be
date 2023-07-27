import { Controller, Get, Param } from '@nestjs/common';
import { DashboardsMasterService } from './dashboards.service';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';

@Controller('master/dashboards')
export class DashboardsMasterController {
  constructor(private readonly dashboardsService: DashboardsMasterService) {}

  @Get('/:tenant_id')
  @Roles('Master')
  async findAllByTenant(@Param('tenant_id') tenant_id) {
    return await this.dashboardsService.findAllByTenant(tenant_id);
  }

  @Get('')
  @Roles('Master')
  async findAll() {
    return await this.dashboardsService.findAll();
  }
}
