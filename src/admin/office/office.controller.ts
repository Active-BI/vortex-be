import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Office')
@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}
  @Roles('Admin')
  @Post()
  upsert(@Body() createOfficeDto: UpdateOfficeDto, @Req() req) {
    const { tenant_id } = req.tokenData;

    return this.officeService.upsert(createOfficeDto,tenant_id);
  }

  @Roles('Admin')
  @Get()
  findAll( @Req() req) {
    const { tenant_id } = req.tokenData;

    return this.officeService.findAll(tenant_id);
  }

  @Roles('Admin')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const { tenant_id } = req.tokenData;

    return this.officeService.findOne(id,tenant_id);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const { tenant_id } = req.tokenData;

    return this.officeService.remove(id,tenant_id);
  }
}
