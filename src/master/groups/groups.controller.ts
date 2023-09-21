import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
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
  constructor(private readonly groupsService: GroupsService) {}

  @Roles('Master')
  @Post()
  async create(@Body() createGroupDto: Create_Page_Group) {
    return this.groupsService.create(createGroupDto);
  }

  @Roles('Master')
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Roles('Master')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Roles('Master')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: Update_Page_Group) {
    console.log(updateGroupDto);
    return this.groupsService.update(id, updateGroupDto);
  }

  @Roles('Master')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
