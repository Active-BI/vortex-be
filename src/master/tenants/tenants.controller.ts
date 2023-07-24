import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { Tenant } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body() createTenant: Tenant) {
    return this.tenantsService.create(createTenant);
  }

  @Get()
  @Roles('Master')
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @Roles('Master')
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @Roles('Master')
  update(@Param('id') id: string, @Body() updateTenan: Tenant) {
    return this.tenantsService.update(id, updateTenan);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
