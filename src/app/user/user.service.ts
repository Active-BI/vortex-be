import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

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
        User_Auth: true,
        Tenant: true,
      },
    });
  }
  async findById(userId, tenant_id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
        tenant_id,
      },
      include: {
        Rls: true,
        User_Auth: true,
        Tenant: true,
      },
    });
  }
  async UpdateUSer(user) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }
  async createUser(user, tenant_id: string) {
    let uuid = uuidv4();
    console.log(user);
    await this.prisma.user.create({
      data: {
        id: uuid,
        name: user.name,
        contact_email: user.email,
        profession: user.profession,
        description: user.description,
        tenant_id,
        rls_id: user.rls_id,
      },
    });
    await this.prisma.user_Auth.create({
      data: {
        normalized_contact_email: (user.email as string).toUpperCase(),
        user_id: uuid,
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

  async deleteUser(id: string) {
    await this.prisma.user_Auth.delete({
      where: {
        user_id: id,
      },
    });
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
