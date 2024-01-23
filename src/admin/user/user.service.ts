import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserAuthService } from 'src/auth/user_auth/user_auth.service';
import { EditUserBody, UserResponse } from './Swagger';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { SmtpService } from 'src/services/smtp.service';
import { message_book } from 'src/services/email_book';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
    private smtpService: SmtpService,
  ) {}
  async findAll(tenant_id: string): Promise<UserResponse[]> {
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
  async findById(userId, tenant_id: string): Promise<UserResponse> {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
        AND: {
          tenant_id,
        },
      },
      include: {
        Rls: true,
        User_Auth: true,
        Tenant: true,
        User_Page: true,
      },
    });
  }
  async UpdateUSer(user: EditUserBody): Promise<UserResponse> {
    console.log(user)
    const userUpdate = await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
    return await this.findById(user.id, userUpdate.tenant_id);
  }
  async createUser(user, tenant_id: string): Promise<{ user_id: string }> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        contact_email: user.email,
        personal_email: user.email,
        office_id: user.office_id,
        tenant_id,
        rls_id: user.rls_id,
      },
    });
    await this.userAuthService.createAuthUser(user.email, user.id);

    return { user_id: user.id };
  }
  async createTransportEmail(userEmail, userId, author_contact_email) {
    const token = await this.jwtStrategy.signRegisterToken({
      userId,
      contact_email: userEmail,
    });
    await this.smtpService.renderMessage(
      message_book.auth.request_new_sign_up(token, author_contact_email),
      [userEmail],
    );
  }

  async acceptRequestAccess(userEmail, userId) {
    const token = await this.jwtStrategy.signRegisterToken({
      userId,
      contact_email: userEmail,
    });
    await this.smtpService.renderMessage(
      message_book.request_new_tenant.accept_new_tennat(token),
      [userEmail],
    );
  }
  async getUser(email: string): Promise<UserResponse> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            contact_email: email,
          },
          {
            personal_email: email,
          },
        ],
      },
      include: {
        Rls: true,
        User_Auth: true,
        Tenant: true,
        User_Page: true,
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
