import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req, UploadedFiles, UseInterceptors, Res, NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Roles('Master')
  @Post(':tenant_id')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles() files: Array<Express.Multer.File>,    // @Body('id_observation') id_observation: string,
    @Param('tenant_id') tenant_id,
    @Body() reqBody: any,
  ) {
    try {
      const projects = JSON.parse(reqBody.body)
      const file = await this.documentsService.upload(files as any, tenant_id, projects);
      return file
    } catch (error) {
        throw new BadRequestException(error)
    }
  }

  @Roles('Master', 'Admin')
  @Get('client-project-filter')
  clientProjectFilters() {
    return this.documentsService.clientProjectFilters();
  }
  @Roles('Master', 'Admin')
  @Get('files/:clienteName')
  async getfiles(@Param('clienteName') nomeCliente) {
    return await this.documentsService.getfiles(nomeCliente);
  }

  @Roles('Master', 'Admin')
  @Get('/download/:id')
  async downloadByIdObservation(@Param('id') id: string, @Res() res) {
    try {
      const arquivo =
        await this.documentsService.findFileById(id);
      if (!arquivo) {
        throw new NotFoundException('Nenhum arquivo encontrado para este ID');
      }
      res.set({
        'Content-Type': 'application/json',
        'Content-Disposition':  `attachment; filename="${arquivo.name}.${arquivo.file_format}"`,
      });
      res.send(arquivo.file);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Arquivo não encontrado')
      } else {
        throw new BadRequestException(error)
      }
    }
  }

  @Roles('Master')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
