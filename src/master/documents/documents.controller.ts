import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
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

  @Roles('Master')
  @Get('client-project-filter')
  clientProjectFilters() {
    return this.documentsService.clientProjectFilters();
  }
  @Roles('Master')
  @Get('files/:clienteName')
  async getfiles(@Param('clienteName') nomeCliente) {
    return await this.documentsService.getfiles(nomeCliente);
  }
  @Roles('Master')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Roles('Master')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Roles('Master')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
