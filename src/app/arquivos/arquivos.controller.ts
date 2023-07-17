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
    @Headers('authorization') authorization: string,
    @Param('tipoRelatorio') tipoRelatorio,
  ) {
    const bearerToken = authorization.split(' ')[1];
    const tableData = await this.arquivosService.exportDataAnalysis(
      bearerToken,
      tipoRelatorio,
    );
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    // Configure os cabeçalhos da resposta para download
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename=export.xlsx',
    );

    // Envie o arquivo XLSX como resposta
    response.send(excelBuffer);
  }
}
