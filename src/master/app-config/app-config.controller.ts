import { Controller, Get, Body, Patch } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';

@Controller('master/app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Roles('Master')
  @Patch()
  update(@Body() updateAppConfigDto: UpdateAppConfigDto) {
    return this.appConfigService.update( updateAppConfigDto);
  }
  @Roles('Master')
  @Get()
  find( ) {
    return this.appConfigService.findOne();
  }
}
