import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminRequestService } from './admin-request.service';
import { Request_admin_access } from '@prisma/client';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Master/admin-request')
@Controller('admin-request')
export class AdminRequestController {
  constructor(private readonly adminRequestService: AdminRequestService) {}

  @Post()
  async create(@Body() createAdminRequestDto: Request_admin_access) {
    return this.adminRequestService.create(createAdminRequestDto);
  }
  @Roles('Master')
  @Post()
  async createByMaster(@Body() createAdminRequestDto: Request_admin_access) {
    return this.adminRequestService.createByMaster(createAdminRequestDto);
  }
  @Roles('Master')
  @Get('/accept/:id')
  async acceptUserRequest(@Param('id') id: string) {
    return this.adminRequestService.acceptUserRequest(id);
  }
  @Roles('Master')
  @Get()
  async findAll() {
    return this.adminRequestService.findAll();
  }
  @Roles('Master')
  @Get('/blocked')
  async findAllBlocked() {
    return this.adminRequestService.findAllBlocked();
  }
  @Roles('Master')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminRequestService.findOne(id);
  }

  @Roles('Master')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminRequestDto: Request_admin_access,
  ) {
    return this.adminRequestService.update(id, updateAdminRequestDto);
  }

  @Roles('Master')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminRequestService.remove(id);
  }
}
