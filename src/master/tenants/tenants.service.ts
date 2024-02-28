import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';

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
        app_image: createTenantDto.app_image,
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
        app_image: updateTenantDto.app_image
      },
    });
  }

  async remove(id: string) {
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
