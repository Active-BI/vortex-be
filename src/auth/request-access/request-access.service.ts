import { BadRequestException, Injectable } from '@nestjs/common';
import { Request_admin_access } from '@prisma/client';
import { UserService } from 'src/admin/user/user.service';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { TempToken } from 'src/helpers/token';
import { PrismaService } from 'src/services/prisma.service';
import { emailToRequestAccess } from './helper';
const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
  auth: {
    user: 'lucas.franca@activebi.com.br',
    pass: '27991190Ll.',
  },
});
@Injectable()
export class RequestAccessService {
  constructor(
    private prisma: PrismaService,
    private jwtStrategy: JwtStrategy,
  ) {}

  async createLinkToRequestAccess(email: string) {
    const findByEmail = await this.prisma.request_admin_access.findFirst({
      where: { email: email.toLocaleLowerCase() },
    });
    const findByEmailAuth = await this.prisma.user.findFirst({
      where: { contact_email: email.toLocaleLowerCase() },
    });
    if (findByEmail || findByEmailAuth)
      throw new BadRequestException('Email já em uso');

    const token = new TempToken(email);
    const signedToken = await this.jwtStrategy.signTempToken(token);
    const link = `${process.env['FRONT_BASE_URL']}auth/request-access/${signedToken}`;
    await transporter.sendMail({
      from: 'homolog@activebi.com.br', // sender address
      to: email, // list of receivers
      subject: 'Código de Acesso', // Subject line
      text: 'secretToReset', // plain text body
      html: emailToRequestAccess(link),
    });
  }
  // Requisição feita por usuário sem login
  async create(createAdminRequestDto: Request_admin_access) {
    if (createAdminRequestDto.company_cnpj.length > 0) {
      const findByCnpj = await this.prisma.request_admin_access.findFirst({
        where: {
          company_cnpj: createAdminRequestDto.company_cnpj,
        },
      });
      const findByTenant = await this.prisma.tenant.findFirst({
        where: {
          tenant_cnpj: createAdminRequestDto.company_cnpj,
        },
      });
      if (findByCnpj || findByTenant)
        throw new BadRequestException('Essa empresa já fez uma solicitação');
    }

    const findByEmail = await this.prisma.request_admin_access.findFirst({
      where: { email: createAdminRequestDto.email.toLocaleLowerCase() },
    });
    const findByEmailAuth = await this.prisma.user.findFirst({
      where: { contact_email: createAdminRequestDto.email.toLocaleLowerCase() },
    });
    if (findByEmail || findByEmailAuth)
      throw new BadRequestException('Esse email já está em uso');

    return this.prisma.request_admin_access.create({
      data: {
        ...createAdminRequestDto,
        email: createAdminRequestDto.email.toLocaleLowerCase(),
      },
    });
  }
}
