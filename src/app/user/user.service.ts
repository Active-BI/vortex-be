import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
