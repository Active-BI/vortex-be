import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { Token } from 'src/helpers/token';

@Injectable()
export class ArquivosService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  validaDados(dados) {
    return true;
  }

  async getTenants(authorization) {
    const token = this.jwtService.decode(authorization);
    const tenant_id = (token as Token).tenant_id;
    return await this.prisma.tenant.findMany({ where: { id: tenant_id } });
  }

  async exportDataAnalysis(bearerToken, tipoRelatorio: string) {
    const token = this.jwtService.decode(bearerToken);
    const tenant_id = (token as Token).tenant_id;

    const data = await this.prisma[tipoRelatorio].findMany({
      where: {
        tenant_id,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return data;
  }
  //   async importDataAnalysis(dados: string, bearerToken: string): Promise<void> {
  //     const token = this.jwtService.decode(bearerToken);
  //     const tenant_id = (token as Token).tenant_id;
  //     const dashboardTanant = await this.prisma.dashBoard_Tenant.findFirst({
  //       where: {
  //         tenant_id: { equals: tenant_id },
  //         AND: {
  //           DashBoard: { tipo: (dados as any).tipo },
  //         },
  //       },
  //     });
  //     await this.prisma.dataAnalysis.deleteMany({
  //       where: { dashBoard_Tenant: dashboardTanant.id },
  //     });
  //     const dadosFormatados = (dados as any).payload.map((dado) => ({
  //       ...dado,
  //       dashBoard_Tenant: dashboardTanant.id,
  //     }));

  //     await this.prisma.dataAnalysis.createMany({
  //       data: dadosFormatados,
  //     });
  //   }
}
