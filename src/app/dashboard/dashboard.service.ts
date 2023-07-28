import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async setDashboardUser(tenantDashBoard, user_id, tenant_id) {
    const tenantDash = await this.prisma.tenant_DashBoard.findMany({
      where: {
        tenant_id,
        AND: {
          id: {
            in: tenantDashBoard,
          },
        },
      },
    });
    await this.prisma.user_Tenant_DashBoard.deleteMany({
      where: { user_id },
    });

    await this.prisma.user_Tenant_DashBoard.createMany({
      data: tenantDash.map((td) => ({
        tenant_DashBoard_id: td.id,
        user_id,
      })),
    });
  }
  async getAllDashboardsByUser(user_id, tenant_id) {
    return await this.prisma.user_Tenant_DashBoard.findMany({
      where: {
        user_id,
        AND: {
          Tenant_DashBoard: {
            tenant_id,
          },
        },
      },
      include: {
        Tenant_DashBoard: {
          include: {
            Dashboard: true,
          },
        },
      },
    });
  }
  async getAllDashboards(tenant_id) {
    return await this.prisma.tenant_DashBoard.findMany({
      where: {
        tenant_id,
      },
      include: {
        Dashboard: true,
      },
    });
  }
}
