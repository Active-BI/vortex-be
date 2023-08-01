import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MasterRequestService } from './admin-request.service';
import { Request_admin_access } from '@prisma/client';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';

@ApiTags('Master/admin-request')
@Controller('admin-request')
export class MasterRequestController {
  constructor(private readonly masterRequestService: MasterRequestService) {}

  @Roles('Master')
  @Post()
  async createByMaster(@Body() createAdminRequestDto: Request_admin_access) {
    return this.masterRequestService.createByMaster(createAdminRequestDto);
  }
  @Roles('Master')
  @Get('/accept/:id/:tenantId')
  async acceptUserRequest(
    @Param('id') id: string,
    @Param('tenantId') tenantId: string,
  ) {
    return this.masterRequestService.acceptUserRequest(id, tenantId);
  }
  @Roles('Master')
  @Get()
  async findAll() {
    return this.masterRequestService.findAll();
  }
  @Roles('Master')
  @Get('/blocked')
  async findAllBlocked() {
    return this.masterRequestService.findAllBlocked();
  }
  @Roles('Master')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.masterRequestService.findOne(id);
  }

  @Roles('Master')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminRequestDto: Request_admin_access,
  ) {
    return this.masterRequestService.update(id, updateAdminRequestDto);
  }

  @Roles('Master')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.masterRequestService.remove(id);
  }
}
