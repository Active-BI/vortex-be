import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
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
}
