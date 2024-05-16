import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { EditUserBody, UserResponse } from './dto/DTOS';

export interface ICreateUser {
  id: string;
  name: string;
  email: string;
  office_id: string;
  projects: string[];
  rls_id: string;
}

const include = {
  Rls: true,
  Tenant: {
    select: {
      tenant_name: true,
    },
  },
};

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async findAll(tenant_id: string): Promise<UserResponse[]> {
    return await this.prisma.user.findMany({
      where: {
        tenant_id,
      },
      include,
    });
  }

  async getUser(email: string): Promise<UserResponse> {
    return this.prisma.user.findFirst({
      where: {
        contact_email: email,
      },
      include: {
        ...include,
        User_Page: true,
      },
    });
  }

  async findById(userId, tenant_id: string): Promise<UserResponse> {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
        AND: {
          tenant_id,
        },
      },
      include: {
        ...include,
        User_Page: true,
      },
    });
  }

  async UpdateUSer(user: EditUserBody): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  async createUser(user: ICreateUser, tenant_id: string): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        contact_email: user.email,
        office_id: user.office_id,
        projects: user.projects,
        tenant_id,
        rls_id: user.rls_id,
      },
    });
  }

  async deleteUser(id: string) {
    await this.prisma.user_Auth.deleteMany({
      where: {
        user_id: id,
      },
    });
    await this.prisma.user_Page.deleteMany({
      where: {
        user_id: id,
      },
    });
    await this.prisma.user.deleteMany({
      where: {
        id: id,
      },
    });
  }
}
