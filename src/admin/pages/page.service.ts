import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { generateBuffer } from 'src/services/templates';


@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}
  /**
   *
   * @param tenantPage [tenant_page_id list]
   * @param user_id
   * @param tenant_id
   */
  async setPageUser(tenantPage, user_id, tenant_id, projects) {
    const tenantDash = await this.prisma.tenant_Page.findMany({
      where: {
        tenant_id,
        AND: {
          id: {
            in: tenantPage,
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

    await this.prisma.user.update({
      where: {
        id: user_id
      },
      data: {
        projects
      }
    })
  }

  /**
   * Usado para  obter as rotas de um usuários admin específico
   */
  async getAllPagesByUser(user_id, tenant_id) {
    return (
      await this.prisma.user_Page.findMany({
        where: {
          user_id,
          AND: {
            Tenant_Page: {
              tenant_id,
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
  async deleteUsersByPage(tenant_id, user_id, page_id) {
    return (
      await this.prisma.tenant_Page.deleteMany({
        where: {
          page_id,
          AND: {
            tenant_id,
            AND: {
              User_Page: {
                some: {
                  user_id
                }
              }
            }
          }
        }
      })
    )
  }
  async getAllUsersByPage(tenant_id) {
    return (
      await this.prisma.tenant_Page.findMany({
        where: {
          tenant_id,
        },
        include: {
          User_Page:{
            select: {
              User: {
                select: {
                  User_Session_Hist: true,
                  name:true,
                  contact_email:true,
                  id:true,
                }
              }
            }
          },
          Page: {
            include: {
              Page_Group: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      })
    )
  }
  async getAllPages(tenant_id) {
    return (
      await this.prisma.tenant_Page.findMany({
        where: {
          tenant_id,
        },
        include: {
          Page: {
            include: {
              Page_Group: {
                select: {
                  title: true,
                },
              },
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
      })
    ).sort((a, b) => a.Page.title.localeCompare(b.Page.title));
  }
  async exportToExcel(data) {
    return generateBuffer(data)
  }
}
