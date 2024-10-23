import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { PbiReportService } from 'src/admin/pbi-report/pbi-report.service';
export type Create_Page_Group = {
  title: string;
  icon: string;
};
export interface Update_Page_Group extends Create_Page_Group {
  id: string;
}
@ApiTags('Master/Groups')
@Controller('master/groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private pbiReportService: PbiReportService,
  ) {}

  @Roles('Master')
  @Post()
  async create(@Body() createGroupDto: Create_Page_Group) {
    return this.groupsService.create(createGroupDto);
  }
  // testando formas de melhorar performance
  // @Roles('Master')
  // @Get('user-groups')
  // find() {
  //   return this.groupsService.faztudo();
  // }

  @Roles('Master')
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Roles('Master')
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    let start = Date.now();
    let group = await this.groupsService.findOne(id);

    return group;
  }

  @Roles('Master')
  @Post('dataset/info')
  async getPbiInfo(@Req() req, @Body() body) {
    const start = Date.now();

    const pagePromises = body.map(async (page) => {
      if (page.page_type !== 'report') {
        return page;
      } else {
        const group_title = page.link.split('/')[1];
        const report_title = page.link.split('/')[2];

        const datasetInf = await this.pbiReportService.getDatasetsInf(
          report_title,
          group_title,
          req.tokenData,
        );

        return { ...page, datasetInf };
      }
    });

    const pages = await Promise.all(pagePromises);


    body = pages;

    return body;
  }

  @Roles('Master')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: Update_Page_Group) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Roles('Master')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
