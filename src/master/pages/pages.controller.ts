import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { PagesMasterService, pageAndRoles } from './pages.service';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { PageService } from 'src/admin/pages/page.service';
import { Update_Page_Group } from '../groups/groups.controller';
import { Page } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/services/prisma.service';
import { randomUUID } from 'crypto';

@ApiTags('Master/pages')
@Controller('master/pages')
export class PagesMasterController {
  constructor(
    private readonly pagesMasterService: PagesMasterService,
    private pageService: PageService,
    private prisma: PrismaService
  ) {}

  @Get('by-tenant/:tenant_id')
  @Roles('Master')
  async findAllByTenant(@Param('tenant_id') tenant_id) {
    return await this.pagesMasterService.findAllByTenant(tenant_id);
  }
  @Get('user/:tenant_id')
  @Roles('Master')
  async findAllByTenantAndUser(@Param('tenant_id') tenant_id) {
    return await this.pagesMasterService.findAllByTenantAndUser(tenant_id);
  }
  @Post('user/:tenant_id')
  @Roles('Master')
  async ByByTenantAndUser(@Param('tenant_id') tenant_id,  @Body() body) {
    return await this.pagesMasterService.postTenantAndUser(body,tenant_id);
  }

  @Get('')
  @Roles('Master')
  async findAll() {
    return await this.pagesMasterService.findAll();
  }

  @Get('/:pageId')
  @Roles('Master')
  async findByPageId(@Param('pageId') userid) {
    return await this.pagesMasterService.findById(userid);
  }

  @Roles('Master')
  @Post('/:userid')
  async setDashboardUser(@Req() req, @Body() body, @Param('userid') userid) {
    const { tenant_id, projetos } = body;
    const getTenantDashBoards =
      await this.pagesMasterService.findAllTenantPage(tenant_id);
    await this.pageService.setPageUser(getTenantDashBoards, userid, tenant_id,projetos);
  }
  @Roles('Master')
  @Patch('/:userid')
  async PatchDashboardUser(@Req() req, @Body() body, @Param('userid') userid) {
    const { tenant_id,DashboardUserList, projetos } = body;
    const getTenantDashBoards = await this.pagesMasterService.findAllTenantPageInArray(DashboardUserList,tenant_id);
    await this.pageService.setPageUser(getTenantDashBoards, userid, tenant_id,projetos);
  }
  @Roles('Master')
  @Post('')
  async postPage(@Body() body: pageAndRoles) {
    return await this.pagesMasterService.create(body);
  }

  @Roles('Master')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: pageAndRoles) {
    return this.pagesMasterService.update(id, updateGroupDto);
  }

  @Roles('Master')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesMasterService.remove(id);
  }
}
