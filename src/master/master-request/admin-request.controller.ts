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
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Master/admin-request')
@Controller('admin-request')
export class MasterRequestController {
  constructor(private readonly masterRequestService: MasterRequestService) {}

  // @Roles('Master')
  // @Post()
  // async createByMaster(@Body() createAdminRequestDto: Request_admin_access) {
  //   return this.masterRequestService.createByMaster(createAdminRequestDto);
  // }
  // @Roles('Master')
  // @Get('/accept/:id/:tenantId')
  // async acceptUserRequest(
  //   @Param('id') id: string,
  //   @Param('tenantId') tenantId: string,
  // ) {
  //   return this.masterRequestService.acceptUserRequest(id, tenantId);
  // }

  // @Roles('Master')
  // @Post('/accept-and-create-tenant/:userId')
  // async acceptUserAnCreateTenantRequest(
  //   @Param('userId') id: string,
  //   @Body() body: any,
  // ) {
  //   return this.masterRequestService.acceptUserAndCreateTenant(id, body);
  // }

  // @Roles('Master')
  // @Get()
  // async findAll() {
  //   return this.masterRequestService.findAll();
  // }
  // @Roles('Master')
  // @Get('/blocked')
  // async findAllBlocked() {
  //   return this.masterRequestService.findAllBlocked();
  // }
  // @Roles('Master')
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.masterRequestService.findOne(id);
  // }

  // @Roles('Master')
  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateAdminRequestDto: Request_admin_access,
  // ) {
  //   return this.masterRequestService.update(id, updateAdminRequestDto);
  // }

  // @Roles('Master')
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.masterRequestService.remove(id);
  // }
}
