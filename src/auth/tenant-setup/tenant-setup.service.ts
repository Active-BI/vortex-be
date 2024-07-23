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
}
