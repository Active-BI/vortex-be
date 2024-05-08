import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {

  }
  async upload(arquivos: Express.Multer.File[], tenant_id: string, projects: string[]) {
    return await Promise.all(arquivos.map(async arquivo => {
      const novoArquivo = await this.prisma.tenant_files.create({
        data: {
          file: arquivo.buffer,
          file_format: arquivo.originalname.split('.').pop(),
          name: `${arquivo.originalname.split('.')[0]}`,
          tenant_id,
          projects
        }
      });

      delete novoArquivo.file
      return novoArquivo
    }))
  }
  async getfiles(tenant_id) {
    if (tenant_id === 'all') return await this.prisma.tenant_files.findMany({ 
      select: {
        id: true,
        file_format: true,
        name: true,
        projects: true,
        tenant_id: true,
        created_at: true
      }})

    return await this.prisma.tenant_files.findMany({
      where: {
        tenant_id: tenant_id
      },
      select: {
        id: true,
        file_format: true,
        name: true,
        projects: true,
        tenant_id: true,
        created_at: true
      }
    })
  }

  async clientProjectFilters() {
    const tenants = await this.prisma.tenant.findMany({
      where: {
        restrict: false
      },
    })

    const projects = await this.prisma.projeto_cliente.findMany()

    return tenants.map(t => ({
      ...t,
      projects: projects.filter(p => p.cliente === t.tenant_name)
    }))
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  async remove(id: string) {
    await this.prisma.tenant_files.delete({
      where: {
        id
      }
    })

    return await this.getfiles('all')
  }
}
