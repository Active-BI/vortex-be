import { BadRequestException, Injectable } from '@nestjs/common';
import { Page } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class PagesMasterService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return (
      await this.prisma.page.findMany({
        where: {
          restrict: false,
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
              Tenant: true,
            },
          },
        },
      })
    ).filter((e) => e.restrict === false);
  }
  async findById(id) {
    return await this.prisma.page.findFirst({
      where: {
        restrict: false,
        AND: {
          id,
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
            Tenant: true,
          },
        },
      },
    });
  }
  async findByTitle(title) {
    return await this.prisma.page.findFirst({
      where: {
        restrict: false,
        AND: {
          title,
        },
      },
    });
  }
  async findAllTenantPage(tenant_id: string) {
    return (
      await this.prisma.tenant_Page.findMany({
        where: {
          tenant_id,
          AND: {
            Page: {
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
        restrict: false,
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
            Tenant: true,
          },
        },
      },
    });

    return dashboads
      .map((d) => {
        if (d.Tenant_Page.find((t) => t.Tenant.id === tenant_id)) {
          return { ...d, included: true };
        }
        return { ...d, included: false };
      })
      .map((e) => {
        const filterTenant = e.Tenant_Page.filter(
          (e) => e.Tenant.id === tenant_id,
        );
        return {
          ...e,
          tenant_Page_id:
            filterTenant.length < 1 ? '' : filterTenant[0].Tenant.id,
          Page_Role: e.Page_Role.map((r) => r.Rls.name),
          Page_Group: e.Page_Group,
        };
      })
      .filter((e) => e.restrict === false);
  }

  async findAllByTenantAndUser(tenant_id) {
    const dashboardsByTenant = await this.prisma.tenant_Page.findMany({
      where: {
        tenant_id,
        AND: {
          Page: {
            restrict: false,
          },
        },
      },
      include: {
        Page: {
          include: {
            Page_Group: true,
          },
        },
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

  async getAllPageMaster() {
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

  async update(id: string, updateGroupDto: Page) {
    return await this.prisma.page.update({
      where: {
        id,
      },
      data: updateGroupDto,
    });
  }
  async create(createGroup: Page) {
    const findPage = await this.findByTitle(createGroup.title);
    if (findPage) {
      throw new BadRequestException('Pagina já existe');
    }
    const id = randomUUID();
    return await this.prisma.page.create({
      data: { ...createGroup, id },
    });
  }
  async remove(id: string) {
    return await this.prisma.page.delete({
      where: {
        id,
      },
    });
  }
}
