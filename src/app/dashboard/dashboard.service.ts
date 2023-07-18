import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async setDashboardUser(tenantDashBoard, user_id, tenant_id) {
    const tenantDash = await this.prisma.tenant_DashBoard.findMany({
      where: {
        tenant_id,
        id: {
          in: tenantDashBoard,
        },
      },
    });

    await this.prisma.user_Tenant_DashBoard.createMany({
      data: tenantDash.map((td) => ({
        tenant_DashBoard_id: td.id,
        user_id,
      })),
    });
  }
  getAllDashboards(tenant_id) {
    this.prisma.tenant_DashBoard.findMany({
      where: {
        tenant_id,
      },
      include: {
        Dashboard: true,
      },
    });
  }
}
