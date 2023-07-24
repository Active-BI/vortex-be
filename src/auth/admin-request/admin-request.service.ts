import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Request_admin_access } from '@prisma/client';
import { UserAuthService } from '../user_auth/user_auth.service';
import { UserService } from 'src/app/user/user.service';

@Injectable()
export class AdminRequestService {
  constructor(
    private prisma: PrismaService,
    private userAuthService: UserAuthService,
    private userService: UserService,
  ) {}
  // Requisição feita por usuário sem login
  async create(createAdminRequestDto: Request_admin_access) {
    const findByEmail = await this.prisma.request_admin_access.findMany({
      where: { email: createAdminRequestDto.email.toLocaleLowerCase() },
    });
    const findByCnpj = await this.prisma.request_admin_access.findMany({
      where: { email: createAdminRequestDto.company_cnpj.toLocaleLowerCase() },
    });
    if (findByEmail || findByCnpj)
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
    return await this.prisma.request_admin_access.findMany();
  }
  async acceptUserRequest(id) {
    const userAuth = await this.findOne(id);
    await this.userService.createUser(userAuth, userAuth.tenant_id);
  }
  async findAllBlocked() {
    return await this.prisma.request_admin_access.findMany({
      where: { blocked: true },
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
    return await this.prisma.request_admin_access.update({
      where: { id },
      data: {
        blocked: true,
      },
    });
  }
}
