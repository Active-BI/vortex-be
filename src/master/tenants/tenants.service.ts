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
        tenant_cnpj: createTenantDto.tenant_cnpj,
        restrict: false,
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
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.tenant.delete({
      where: { id: id },
    });
  }
}
