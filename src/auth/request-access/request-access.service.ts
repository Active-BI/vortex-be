import { BadRequestException, Injectable } from '@nestjs/common';
import { Request_admin_access } from '@prisma/client';
import { UserService } from 'src/app/user/user.service';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { TempToken } from 'src/helpers/token';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class RequestAccessService {
  constructor(
    private prisma: PrismaService,
    private jwtStrategy: JwtStrategy,
  ) {}

  async createLinkToRequestAccess(email: string) {
    const findByEmail = await this.prisma.request_admin_access.findFirst({
      where: { email: email.toLocaleLowerCase() },
    });
    const findByEmailAuth = await this.prisma.user.findFirst({
      where: { contact_email: email.toLocaleLowerCase() },
    });
    if (findByEmail || findByEmailAuth)
      throw new BadRequestException('Email já em uso');

    const token = new TempToken(email);
    const signedToken = await this.jwtStrategy.signTempToken(token);

    console.log(signedToken);
  }
  // Requisição feita por usuário sem login
  async create(createAdminRequestDto: Request_admin_access) {
    const findByCnpj = await this.prisma.request_admin_access.findFirst({
      where: {
        company_cnpj: createAdminRequestDto.company_cnpj,
      },
    });
    const findByTenant = await this.prisma.tenant.findFirst({
      where: {
        tenant_cnpj: createAdminRequestDto.company_cnpj,
      },
    });
    if (findByCnpj || findByTenant)
      throw new BadRequestException('Solicitação já foi enviada');

    return this.prisma.request_admin_access.create({
      data: {
        ...createAdminRequestDto,
        email: createAdminRequestDto.email.toLocaleLowerCase(),
      },
    });
  }
}
