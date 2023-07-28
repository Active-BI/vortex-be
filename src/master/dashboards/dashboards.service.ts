import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DashboardsMasterService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.dashBoard.findMany();
  }
  async findAllTenantDashboard(tenant_id: string, dashboardIdList: string[]) {
    return (
      await this.prisma.tenant_DashBoard.findMany({
        where: {
          tenant_id,
          AND: {
            dashboard_id: {
              in: dashboardIdList,
            },
          },
        },
      })
    ).map((d) => d.id);
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

  async findAllByTenantAndUser(tenant_id) {
    const dashboardsByTenant = await this.prisma.tenant_DashBoard.findMany({
      where: {
        tenant_id,
      },
      include: {
        Dashboard: true,
      },
    });
    const users = await this.prisma.user.findMany({
      where: {
        tenant_id,
        AND: {
          Rls: {
            name: 'Admin',
          },
        },
      },
      select: {
        name: true,
        id: true,
        Rls: true,
        Tenant: true,
        User_Auth: {
          select: {
            last_access: true,
          },
        },
        User_Tenant_DashBoard: {
          include: {
            Tenant_DashBoard: true,
          },
        },
      },
    });
    let userlist = {};
    users.forEach((user) => {
      const fakeUser = { ...user };
      delete fakeUser.User_Tenant_DashBoard;
      delete fakeUser.User_Auth;
      userlist[user.id] = {
        ...fakeUser,
        last_access: user.User_Auth.last_access,
        dashboards: [],
      };
      dashboardsByTenant.forEach((dash) => {
        const find = user.User_Tenant_DashBoard.find(
          (user_dash) =>
            dash.dashboard_id === user_dash.Tenant_DashBoard.dashboard_id,
        );
        if (find)
          userlist[user.id].dashboards.push({
            ...dash,
            included: true,
          });
        if (!find)
          userlist[user.id].dashboards.push({
            ...dash,
            included: false,
          });
      });
    });

    return Object.values(userlist);
  }
}
