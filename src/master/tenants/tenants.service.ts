import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Tenant } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}
  async create(createTenantDto: any) {
    const id = uuidv4();
    await this.prisma.tenant.create({
      data: {
        id,
        active: createTenantDto.active,
        tenant_name: createTenantDto.tenant_name,
      },
    });
    await this.prisma.tenant_DashBoard.createMany({
      data: createTenantDto.dashboard.map((d) => ({
        dashboard_id: d,
        tenant_id: id,
      })),
    });
    return createTenantDto;
  }

  async findAll() {
    return await this.prisma.tenant.findMany({
      orderBy: {
        tenant_name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.tenant.findFirstOrThrow({ where: { id } });
  }

  async update(id: string, updateTenantDto: any) {
    await this.prisma.user_Tenant_DashBoard.deleteMany({
      where: {
        Tenant_DashBoard: {
          tenant_id: id,
          AND: {
            dashboard_id: {
              notIn: updateTenantDto.dashboard,
            },
          },
        },
      },
    });

    await this.prisma.tenant_DashBoard.deleteMany({
      where: {
        tenant_id: id,
        AND: {
          dashboard_id: {
            notIn: updateTenantDto.dashboard,
          },
        },
      },
    });
    (updateTenantDto.dashboard as string[]).forEach(async (e) => {
      if (
        (
          await this.prisma.tenant_DashBoard.findMany({
            where: {
              tenant_id: id,
            },
          })
        )
          .map((d) => d.dashboard_id)
          .includes(e)
      ) {
        return;
      } else {
        await this.prisma.tenant_DashBoard.createMany({
          data: {
            dashboard_id: e,
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
