import { Injectable } from '@nestjs/common';
import { User_Auth } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class UserAuthService {
  constructor(private prisma: PrismaService) {}

  async getUserAuth(email: string) {
    return this.prisma.user_Auth.findFirst({
      where: {
        normalized_contact_email: email.toUpperCase(),
      },
      include: {
        User: {
          include: {
            Tenant: true,
            Rls: true,
          },
        },
      },
    });
  }
  async createAuthUser(email, uuid) {
    await this.prisma.user_Auth.create({
      data: {
        normalized_contact_email: (email as string).toUpperCase(),
        user_id: uuid,
        anchor: false,
      },
    });
  }
  async update(user: User_Auth) {
    await this.prisma.user_Auth.update({
      where: { user_id: user.user_id },
      data: {
        normalized_contact_email: user.normalized_contact_email,
        password_hash: user.password_hash,
        reset_pass: user.reset_pass,
        secret: user.secret,
        last_access: new Date(),
      },
    });
  }
}
