import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserAuthService } from 'src/auth/user_auth/user_auth.service';
import { v4 as uuidv4 } from 'uuid';
import { EditUserBody, UserResponse } from './Swagger';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { transporter } from 'src/auth/login/login.service';
import {
  htmlAcceptRequestAccess,
  htmlLogin,
  htmlRegister,
} from 'src/auth/login/helper';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
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
    const userUpdate = await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
    return await this.findById(user.id, userUpdate.tenant_id);
  }
  async createUser(user, tenant_id: string): Promise<{ user_id: string }> {
    let uuid = uuidv4();
    await this.prisma.user.create({
      data: {
        id: uuid,
        name: user.name,
        contact_email: user.email,
        personal_email: user.email,
        profession: user.profession,
        description: user.description,
        tenant_id,
        rls_id: user.rls_id,
      },
    });
    await this.userAuthService.createAuthUser(user.email, uuid);

    return { user_id: uuid };
  }
  async createTransportEmail(userEmail, userId, author_contact_email) {
    const token = await this.jwtStrategy.signRegisterToken({
      userId,
      contact_email: userEmail,
    });
    try {
      const email = await transporter.sendMail({
        from: 'embedded@activebi.com.br', // sender address
        to: userEmail, // list of receivers
        subject: 'Active PME - Conclua seu cadastro', // Subject line
        text: 'Ingresso solicitado', // plain text body
        html: htmlRegister(token, author_contact_email),
      });
      console.log(email);
    } catch (e) {
      console.log(e);
    }
  }

  async acceptRequestAccess(userEmail, userId) {
    const token = await this.jwtStrategy.signRegisterToken({
      userId,
      contact_email: userEmail,
    });
    try {
      const email = await transporter.sendMail({
        from: 'embedded@activebi.com.br', // sender address
        to: userEmail, // list of receivers
        subject: 'Active PME - Solicitação aprovada!!!', // Subject line
        text: 'Ingresso solicitado', // plain text body
        html: htmlAcceptRequestAccess(token),
      });
      console.log(email);
    } catch (e) {
      console.log(e);
    }
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
    await this.prisma.user_Page.deleteMany({
      where: {
        user_id: id,
      },
    });
    await this.prisma.user_Auth.deleteMany({
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
