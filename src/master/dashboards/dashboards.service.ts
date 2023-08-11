import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DashboardsMasterService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.page.findMany({
      where: {
        Tenant_Page: {
          some: {
            Tenant: {
              restrict: false,
            },
          },
        },
      },
    });
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
        Page_Group: true,
        Page_Role: {
          select: {
            Rls: {
              select: {
                name: true,
              },
            },
          },
        },
        Tenant_Page: {
          select: {
            tenant_id: true,
          },
        },
      },
    });

    return dashboads
      .map((d) => {
        if (d.Tenant_Page.find((t) => t.tenant_id === tenant_id)) {
          return { ...d, included: true };
        }
        return { ...d, included: false };
      })
      .map((e) => {
        const filterTenant = e.Tenant_Page.filter(
          (e) => e.tenant_id === tenant_id,
        );
        return {
          ...e,
          tenant_Page_id:
            filterTenant.length < 1 ? '' : filterTenant[0].tenant_id,
          Page_Role: e.Page_Role.map((r) => r.Rls.name),
          Page_Group: e.Page_Group,
        };
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

  /**
   * Usado para gerar rotas que o master possui acesso
   * @returns 'rotas que o usuário master possui acesso'
   */

  async getAllDashboardsMaster() {
    return (
      await this.prisma.user_Page.findMany({
        where: {
          Tenant_Page: {
            Page: {
              Page_Role: {
                some: {
                  Rls: {
                    name: 'Master',
                  },
                },
              },
            },
          },
        },
        select: {
          Tenant_Page: {
            select: {
              Page: {
                include: {
                  Page_Group: true,
                  Page_Role: {
                    select: {
                      Rls: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
    ).map((e) => ({
      ...e.Tenant_Page.Page,
      Page_Role: e.Tenant_Page.Page.Page_Role.map((r) => r.Rls.name),
      Page_Group: e.Tenant_Page.Page.Page_Group,
    }));
  }
}
