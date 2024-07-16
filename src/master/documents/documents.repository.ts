import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DomcumentsRepository {
  constructor(private prisma: PrismaService) {}
  async upload(
    arquivos: Express.Multer.File[],
    tenant_id: string,
    projects: string[],
    description: string
  ) {
    return await Promise.all(
      arquivos.map(async (arquivo) => {
        const novoArquivo = await this.prisma.tenant_files.create({
          data: {
            file: arquivo.buffer,
            file_format: arquivo.originalname.split('.').pop(),
            name: `${arquivo.originalname.split('.')[0]}`,
            tenant_id,
            projects,
            description
          },
        });

        delete novoArquivo.file;
        return novoArquivo;
      }),
    );
  }
  async getfiles(tenant_id) {
    if (tenant_id === 'all')
      return await this.prisma.tenant_files.findMany({
        select: {
          id: true,
          file_format: true,
          name: true,
          description: true,
          projects: true,
          tenant_id: true,
          created_at: true,
        },
      });

    return await this.prisma.tenant_files.findMany({
      where: {
        tenant_id: tenant_id,
      },
      select: {
        id: true,
        file_format: true,
        name: true,
          description: true,
          projects: true,
        tenant_id: true,
        created_at: true,
      },
    });
  }
  async findFileById(id) {
    return await this.prisma.tenant_files.findUnique({
      where: {
        id,
      },
    });
  }
  async clientProjectFilters() {
    const tenants = await this.prisma.tenant.findMany({
      where: {
        restrict: false,
      },
    });

    const projects = await this.prisma.projeto_cliente.findMany();

    return tenants.map((t) => ({
      ...t,
      projects: projects.filter((p) => p.cliente === t.tenant_name),
    }));
  }

  async remove(id: string) {
    await this.prisma.tenant_files.delete({
      where: {
        id,
      },
    });

    return await this.getfiles('all');
  }
}
