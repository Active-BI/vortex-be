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
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export class ProjetosDto {
  @ApiProperty()
  cliente: string
  @ApiProperty()
  projeto: string
}

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Roles('Master')
  @Post()
  create(@Body() createTenant: Tenant) {
    return this.tenantsService.create(createTenant);
  }

  @Roles('Master')
  @Post('projects')
  uploadProjects(@Body() createTenant: ProjetosDto[]) {
    return this.tenantsService.upload(createTenant);
  }
  @Roles('Master')
  @Get('projects/:cliente')
  getProjects(@Param('cliente') cliente: string) {
    return this.tenantsService.getProjects(cliente);
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
  @Roles('Master')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
