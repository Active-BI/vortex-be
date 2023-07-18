import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findAll(tenant_id: string) {
    return await this.prisma.user.findMany({
      where: {
        tenant_id,
      },
      include: {
        Rls: true,
      },
    });
  }

  async createUser(user, tenant_id: string) {
    return this.prisma.user.create({
      data: {
        name: user.name,
        contact_email: user.contact_email,
        profession: user.profession,
        description: user.description,
        tenant_id,
        rls_id: user.role_id,
      },
    });
  }
  async getUser(email: string) {
    return this.prisma.user.findFirst({
      where: {
        contact_email: email.toUpperCase(),
      },
      include: {
        Rls: true,
      },
    });
  }
}
