import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}
  async setPageUser(tenantPage, user_id, tenant_id) {
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

  async getAllPages(tenant_id) {
    return await this.prisma.tenant_Page.findMany({
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
    });
  }
}
