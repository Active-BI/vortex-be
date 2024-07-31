import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class TenantSetupService {
  constructor(private prisma: PrismaService) {}

  async getPageImage() {
    const app = await this.prisma.app.findFirst({
      where: {
        id: 'd25bd198-782b-486f-a9b2-d8a288ab3673',
      },
    });
    return {
      app_image: app.bg_image,
      tenant_image: app.logo,
      bg_color: app.bg_color,
    };
  }

  async getTenantConfig(tenantId: any) {
    return this.prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        tenant_color: true,
        tenant_image: true,
      },
    });
  }

  async getPagesThatUserHasAccess(user_id: string) {
    return (
      await this.prisma.page.findMany({
        where: {
          Tenant_Page: {
            some: {
              User_Page: {
                some: {
                  user_id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          group_id: true,
        },
      })
    ).map((e) => e.id);
  }

  async getGroupsThatTenantHasAccess(tenant_id: string) {
    return await this.prisma.page_Group.findMany({
      where: {
        Page: {
          some: {
            Tenant_Page: {
              some: {
                tenant_id,
              },
            },
          },
        },
      },
      select: {
        formated_title: true,
        icon: true,
        restrict: true,
        title: true,
        id: true,
        Page: {
          include: {
            Page_Role: {
              select: {
                Rls: true,
              },
            },
          },
        },
      },
    });
  }
  async getUserRoutes(user_id: string, tenant_id: string) {
    const pageList = await this.getPagesThatUserHasAccess(user_id);
    const groupList = await this.getGroupsThatTenantHasAccess(tenant_id);

    return groupList.map((e) => {
      return {
        ...e,
        Page: e.Page.filter((p) => pageList.includes(p.id)).map((p) => ({
          ...p,
          Page_Role: p.Page_Role.map((r) => r.Rls.name),
        })),
      };
    });
  }
}
