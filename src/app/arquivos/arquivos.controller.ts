import {
  Body,
  Controller,
  Post,
  Headers,
  Get,
  Res,
  Req,
  Request,
  Param,
} from '@nestjs/common';
import { ArquivosService } from './arquivos.service';
import * as XLSX from 'xlsx';

@Controller('arquivos')
export class ArquivosController {
  constructor(private readonly arquivosService: ArquivosService) {}

  @Post()
  importarDadosMockados(
    @Request() req,
    @Body() dados: string,
    @Headers('authorization') authorization: string,
  ) {
    const { userId, tenant_id, role_name } = req.tokenData;

    // this.arquivosService.importDataAnalysis(dados, bearerToken);
  }

  @Get('/:tipoRelatorio')
  async ExportarDadosMockados(
    @Res() response,
    @Req() req,
    @Param('tipoRelatorio') tipoRelatorio,
  ) {}
}
