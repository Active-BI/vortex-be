import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ProjetosDto } from './tenants.controller';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}
  async create(createTenantDto: any) {
    const id = uuidv4();
    await this.prisma.tenant.create({
      data: {
        id,
        active: createTenantDto?.active ? true : false,
        tenant_name: createTenantDto.tenant_name,
        tenant_color: createTenantDto.tenant_color,
        tenant_image: createTenantDto.tenant_image,
        tenant_cnpj: createTenantDto.tenant_cnpj,
        company_segment: createTenantDto.company_segment,
        company_size: createTenantDto.company_size,
        company_uf: createTenantDto.company_uf,
        company_description: createTenantDto.company_description
      },
    });
    await this.prisma.tenant_Page.createMany({
      data: createTenantDto.dashboard.map((d) => ({
        page_id: d,
        tenant_id: id,
      })),
    });
    return { tenant_id: id, ...createTenantDto };
  }
  async findAll() {
    return await this.prisma.tenant.findMany({
      where: {
        restrict: false,
      },
      orderBy: {
        tenant_name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.tenant.findFirstOrThrow({ where: { id } });
  }

  async upload(projetos: ProjetosDto[]) {
    // await this.prisma.projeto_cliente.deleteMany()
    await Promise.all(projetos.map(async (projeto) => {
      await this.prisma.projeto_cliente.upsert({
        where: { id: projeto.id }, // Verifica se o produto existe
        create: { ...projeto },      // Dados para criação (novo produto)
        update: { cliente: projeto.cliente, projeto: projeto.projeto }, // Dados para atualização
      });
    }));
  }
  async getProjects(cliente: string) {
    const clientes = await this.prisma.projeto_cliente.findMany({
      where: {
        cliente: cliente
      },
    })
    return clientes
  }
  async update(id: string, updateTenantDto: any) {
    await this.prisma.user_Page.deleteMany({
      where: {
        Tenant_Page: {
          tenant_id: id,
          AND: {
            page_id: {
              notIn: updateTenantDto.dashboard,
            },
          },
        },
      },
    });

    await this.prisma.tenant_Page.deleteMany({
      where: {
        tenant_id: id,
        AND: {
          page_id: {
            notIn: updateTenantDto.dashboard,
          },
        },
      },
    });
      (updateTenantDto.dashboard as string[]).forEach(async (e) => {
        if (
          (
            await this.prisma.tenant_Page.findMany({
              where: {
                tenant_id: id,
              },
            })
          )
            .map((d) => d.page_id)
            .includes(e)
        ) {
          return;
        } else {
          await this.prisma.tenant_Page.createMany({
            data: {
              page_id: e,
              tenant_id: id,
            },
          });
        }
      });

    return await this.prisma.tenant.update({
      where: { id: id },
      data: {
        active: updateTenantDto.active,
        tenant_name: updateTenantDto.tenant_name,
        tenant_color: updateTenantDto.tenant_color,
        tenant_image: updateTenantDto.tenant_image,
        company_segment: updateTenantDto.company_segment,
        company_size: updateTenantDto.company_size,
        company_uf: updateTenantDto.company_uf,
        company_description: updateTenantDto.company_description,
        tenant_cnpj: updateTenantDto.tenant_cnpj,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.office.deleteMany({
       where: { tenant_id: id },
     });
    await this.prisma.tenant.delete({
       where: {
         id: id,
       },
     });
     // const pages = await this.prisma.tenant_Page.deleteMany({
     //   where: {
     //     tenant_id: id,
     //   },
     // });
     // return await this.prisma.tenant.delete({
     //   where: { id: id },
     // });
   }
}
