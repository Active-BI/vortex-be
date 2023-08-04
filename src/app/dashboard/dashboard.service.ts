import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async setDashboardUser(tenantDashBoard, user_id, tenant_id) {
    const tenantDash = await this.prisma.tenant_Page.findMany({
      where: {
        tenant_id,
        AND: {
          id: {
            in: tenantDashBoard,
          },
        },
      },
    });
    await this.prisma.user_Page.deleteMany({
      where: { user_id },
    });

    await this.prisma.user_Page.createMany({
      data: tenantDash.map((td) => ({
        tenant_page_id: td.id,
        user_id,
      })),
    });
  }
  async getAllDashboardsByUser(user_id, tenant_id) {
    return await this.prisma.user_Page.findMany({
      where: {
        user_id,
        AND: {
          Tenant_Page: {
            tenant_id,
          },
        },
      },
      include: {
        Tenant_Page: {
          include: {
            Page: true,
          },
        },
      },
    });
  }
  async getAllDashboards(tenant_id) {
    return await this.prisma.tenant_Page.findMany({
      where: {
        tenant_id,
      },
      include: {
        Page: true,
      },
    });
  }
}
