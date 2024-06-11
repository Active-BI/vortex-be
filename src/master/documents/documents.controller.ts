import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { ProjectFilterResponse } from './entities/project-filters-response';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Roles('Master')
  @Post(':tenant_id')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('tenant_id') tenant_id,
    @Body() reqBody: any,
  ) {
    const { body } = reqBody;
    await this.documentsService.upload(body, tenant_id, files);
  }
  @Roles('Master', 'Admin')
  @Get('client-project-filter')
  @ApiResponse({ type: ProjectFilterResponse })
  async clientProjectFilters() {
    return await this.documentsService.findManyTenantNotRestricted();
  }
  @Roles('Master', 'Admin')
  @Get('files/:clienteName')
  async getfiles(@Param('clienteName') nomeCliente) {
    return await this.documentsService.findManyTenantFiles(nomeCliente);
  }

  @Roles('Master', 'Admin')
  @Get('/download/:id')
  async downloadByIdObservation(@Param('id') id: string, @Res() res) {
    const arquivo = await this.documentsService.findFileById(id);
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${arquivo.name}.${arquivo.file_format}"`,
    });
    res.send(arquivo.file);
  }

  @Roles('Master')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.documentsService.remove(id);
  }
}
