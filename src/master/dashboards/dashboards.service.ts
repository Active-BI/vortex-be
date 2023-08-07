import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DashboardsMasterService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.page.findMany();
  }
  async findAllTenantDashboard(tenant_id: string, dashboardIdList: string[]) {
    return (
      await this.prisma.tenant_Page.findMany({
        where: {
          tenant_id,
          AND: {
            page_id: {
              in: dashboardIdList,
            },
            Tenant: {
              restrict: false,
            },
          },
        },
      })
    ).map((d) => d.id);
  }
  async findAllByTenant(tenant_id) {
    const dashboads = await this.prisma.page.findMany({
      where: {
        Tenant_Page: {
          some: {
            Tenant: {
              restrict: false,
            },
          },
        },
      },
      include: {
        Tenant_Page: true,
      },
    });

    return dashboads.map((d) => {
      if (d.Tenant_Page.find((t) => t.tenant_id === tenant_id)) {
        delete d.Tenant_Page;
        return { ...d, included: true };
      }
      delete d.Tenant_Page;
      return { ...d, included: false };
    });
  }

  async findAllByTenantAndUser(tenant_id) {
    const dashboardsByTenant = await this.prisma.tenant_Page.findMany({
      where: {
        tenant_id,
        AND: {
          Tenant: {
            restrict: false,
          },
        },
      },
      include: {
        Page: true,
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
        User_Page: {
          include: {
            Tenant_Page: true,
          },
        },
      },
    });
    let userlist = {};
    users.forEach((user) => {
      const fakeUser = { ...user };
      delete fakeUser.User_Page;
      delete fakeUser.User_Auth;
      userlist[user.id] = {
        ...fakeUser,
        last_access: user.User_Auth.last_access,
        dashboards: [],
      };
      dashboardsByTenant.forEach((dash) => {
        const find = user.User_Page.find(
          (user_dash) => dash.page_id === user_dash.Tenant_Page.page_id,
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
