import { Injectable } from '@nestjs/common';
import { User, User_Auth } from '@prisma/client';
import { DefaultArgs, GetResult } from '@prisma/client/runtime/library';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';

interface getUserAuth {
  User: GetResult<
    {
      id: string;
      nome: string;
      born_date: Date;
      personal_email: string;
      contact_email: string;
      profession: string;
      description: string;
      tenant_id: string;
      rls_id: string;
    },
    {}
  > & {};
}

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
            Rls: true,
          },
        },
      },
    });
  }

  async update(user: User_Auth) {
    console.log(user.id, user.user_id);
    await this.prisma.user_Auth.update({
      where: { user_id: user.user_id },
      data: {
        last_access: new Date(),
      },
    });
  }
}
