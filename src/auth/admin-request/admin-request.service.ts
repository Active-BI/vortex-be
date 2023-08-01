import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { PrismaClient, Request_admin_access } from '@prisma/client';
import { UserAuthService } from '../user_auth/user_auth.service';
import { UserService } from 'src/app/user/user.service';
import { roles } from 'prisma/seedHelp';

@Injectable()
export class AdminRequestService {
  constructor(
    private prisma: PrismaService,
    private userAuthService: UserAuthService,
    private userService: UserService,
  ) {}
  // Requisição feita por usuário sem login
  async create(createAdminRequestDto: Request_admin_access) {
    const findByEmail = await this.prisma.request_admin_access.findFirst({
      where: { email: createAdminRequestDto.email.toLocaleLowerCase() },
    });
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
    if (findByEmail || findByCnpj || findByTenant)
      throw new BadRequestException('Solicitação já foi enviada');

    return this.prisma.request_admin_access.create({
      data: {
        ...createAdminRequestDto,
        email: createAdminRequestDto.email.toLocaleLowerCase(),
      },
    });
  }

  async createByMaster(createAdminRequestDto: Request_admin_access) {
    const findByEmail = await this.prisma.request_admin_access.findMany({
      where: { email: createAdminRequestDto.email.toLocaleLowerCase() },
    });
    if (findByEmail)
      throw new BadRequestException('Solicitação já foi enviada');

    return this.prisma.request_admin_access.create({
      data: {
        ...createAdminRequestDto,
        email: createAdminRequestDto.email.toLocaleLowerCase(),
        accept: true,
        blocked: false,
      },
    });
  }
  async findAll() {
    return await this.prisma.request_admin_access.findMany({
      where: { OR: [{ accept: false }] },
      orderBy: {
        name: 'asc',
      },
    });
  }
  async acceptUserRequest(id, tenant_id) {
    const userAuth = await this.findOne(id);

    const alreadyExists = await this.userService.getUser(userAuth.email);
    if (alreadyExists) {
      throw new BadRequestException('Email já está em uso');
    }
    await this.userService.createUser(
      { ...userAuth, rls_id: roles[1].id },
      tenant_id,
    );
    await this.prisma.request_admin_access.update({
      where: { id },
      data: {
        ...userAuth,
        accept: true,
      },
    });
  }
  async findAllBlocked() {
    return await this.prisma.request_admin_access.findMany({
      where: { blocked: true },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.request_admin_access.findFirstOrThrow({
      where: { id },
    });
  }

  async update(id: string, updateAdminRequestDto: Request_admin_access) {
    return await this.prisma.request_admin_access.update({
      where: { id },
      data: {
        ...updateAdminRequestDto,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.request_admin_access.delete({
      where: { id },
    });
  }
}
