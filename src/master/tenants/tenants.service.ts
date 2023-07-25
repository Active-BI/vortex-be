import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Tenant } from '@prisma/client';
import { UserService } from 'src/app/user/user.service';

@Injectable()
export class TenantsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  async create(createTenantDto: Tenant) {
    return await this.prisma.tenant.create({
      data: {
        ...createTenantDto,
        active: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.tenant.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.tenant.findFirstOrThrow({ where: { id } });
  }

  async update(id: string, updateTenantDto: Tenant) {
    return await this.prisma.tenant.update({
      where: { id: id },
      data: {
        ...updateTenantDto,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.tenant.update({
      where: { id: id },
      data: {
        active: false,
      },
    });
  }
}
