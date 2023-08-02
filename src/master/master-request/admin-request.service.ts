import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Request_admin_access } from '@prisma/client';
import { UserService } from 'src/admin/user/user.service';
import { roles } from 'prisma/seedHelp';
import { TenantsService } from '../tenants/tenants.service';
import { DashboardsMasterService } from '../dashboards/dashboards.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Injectable()
export class MasterRequestService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private tenantService: TenantsService,
    private dashboardsService: DashboardsMasterService,
    private dashboardAdminService: DashboardService,
  ) {}

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
  async acceptUserAndCreateTenant(userId, body) {
    const tenant = await this.tenantService.create(body);

    await this.acceptUserRequest(userId, tenant.tenant_id);
  }
  async acceptUserRequest(id, tenant_id) {
    const userAuth = await this.findOne(id);
    const alreadyExists = await this.userService.getUser(userAuth.email);
    if (alreadyExists) {
      throw new BadRequestException('Email já está em uso');
    }
    const { user_id } = await this.userService.createUser(
      { ...userAuth, rls_id: roles[1].id },
      tenant_id,
    );
    const tenantsDisponiveis = await this.prisma.tenant_DashBoard.findMany({
      where: { tenant_id },
    });
    await this.prisma.user_Tenant_DashBoard.createMany({
      data: tenantsDisponiveis.map((td) => ({
        tenant_DashBoard_id: td.id,
        user_id,
      })),
    });
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
