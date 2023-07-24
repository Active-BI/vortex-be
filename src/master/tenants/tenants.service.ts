import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Tenant } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}
  async create(createTenantDto: Tenant) {
    return await this.prisma.tenant.create({
      data: {
        ...createTenantDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.tenant.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.tenant.findMany({ where: { id } });
  }

  async update(id: string, updateTenantDto: Tenant) {
    return await this.prisma.tenant.update({
      where: { id: id },
      data: {
        ...updateTenantDto,
      },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} tenant`;
  }
}
