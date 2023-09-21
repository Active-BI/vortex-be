import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/:type')
  async importFile(@Param('type') type, @Req() req, @Body() dados) {
    const { userId, tenant_id } = req.tokenData;
    await this.filesService.getPageType(type, tenant_id, userId);
    await this.filesService.postFile(dados, tenant_id, type);
  }

  @Get('download-pbi-data/:type')
  async downloadFile(@Param('type') type, @Req() req, @Res() res) {
    const { userId, tenant_id } = req.tokenData;
    await this.filesService.getPageType(type, tenant_id, userId);

    const buffer = await this.filesService.getFile(type, tenant_id);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=file.xlsx');

    res.send(buffer);
  }
  @Get('get-template/:type')
  async downloadTemplate(@Param('type') type, @Req() req, @Res() res) {
    const { userId, tenant_id } = req.tokenData;
    await this.filesService.getPageType(type, tenant_id, userId);

    const buffer = this.filesService.getTemplate(type);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=file.xlsx');

    res.send(buffer);
  }
}
