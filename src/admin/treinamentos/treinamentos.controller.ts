import { Controller, Get, Param,  } from '@nestjs/common';
import { TreinamentosService } from './treinamentos.service';
import { Roles } from '../../helpers/roleDecorator/roles.decorator';

@Controller('treinamentos')
export class TreinamentosController {
  constructor(private readonly treinamentosService: TreinamentosService) {}
  @Get(':playlist')
  @Roles('Admin', 'User', "Master")
  async findOne(@Param('playlist') id: string) {
    return await this.treinamentosService.findAll(id);
  }
}
