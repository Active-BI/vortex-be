import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardsMasterService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.dashBoard.findMany();
  }

  async findAllByTenant(tenant_id) {
    const dashboads = await this.prisma.dashBoard.findMany({
      include: {
        Tenant_DashBoard: true,
      },
    });

    return dashboads.map((d) => {
      if (d.Tenant_DashBoard.find((t) => t.tenant_id === tenant_id)) {
        delete d.Tenant_DashBoard;
        return { ...d, included: true };
      }
      delete d.Tenant_DashBoard;
      return { ...d, included: false };
    });
  }
}
