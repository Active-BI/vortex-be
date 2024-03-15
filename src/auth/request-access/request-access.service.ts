import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { PrismaService } from 'src/services/prisma.service';
import { randomUUID } from 'crypto';
import { SmtpService } from 'src/services/smtp.service';
import { message_book } from 'src/services/email_book';

@Injectable()
export class RequestAccessService {
  constructor(
    private prisma: PrismaService,
    private jwtStrategy: JwtStrategy,
    private smtpService: SmtpService,
  ) {}

  // async createLinkToConfirmRequestAccess(
  //   createAdminRequestDto: Request_admin_access,
  // ) {
  //   if (createAdminRequestDto.company_cnpj.length > 0) {
  //     const findByCnpj = await this.prisma.request_admin_access.findFirst({
  //       where: {
  //         company_cnpj: createAdminRequestDto.company_cnpj,
  //       },
  //     });
  //     const findByTenant = await this.prisma.tenant.findFirst({
  //       where: {
  //         tenant_cnpj: createAdminRequestDto.company_cnpj,
  //       },
  //     });
  //     if (findByCnpj || findByTenant)
  //       throw new BadRequestException('Essa empresa já fez uma solicitação');
  //   }

  //   const findByEmail = await this.prisma.request_admin_access.findFirst({
  //     where: { email: createAdminRequestDto.email.toLowerCase() },
  //   });
  //   const findByEmailAuth = await this.prisma.user.findFirst({
  //     where: { contact_email: createAdminRequestDto.email.toLowerCase() },
  //   });
  //   if (findByEmail || findByEmailAuth)
  //     throw new BadRequestException('Esse email já está em uso');

  //   const signedToken = await this.jwtStrategy.signConfirmRequest({
  //     ...createAdminRequestDto,
  //     id: randomUUID(),
  //   });

  //   const link = `${process.env['FRONT_BASE_URL']}/#/auth/request-access/${signedToken}`;
  //   await this.smtpService.renderMessage(
  //     message_book.request_new_tenant.email_to_confirm_new_tenant_request_access(
  //       link,
  //     ),
  //     [createAdminRequestDto.email],
  //   );
  // }
  // Requisição feita por usuário sem login
  // async create(token: string) {
  //   const validate = await this.jwtStrategy.validate(token);

  //   delete validate.iat;
  //   delete validate.exp;
  //   const findRegister = this.prisma.request_admin_access.findFirst({
  //     where: {
  //       OR: [
  //         {
  //           id: validate.id,
  //         },
  //         {
  //           email: validate.email,
  //         },
  //       ],
  //     },
  //   });
  //   if (!findRegister)
  //     throw new BadRequestException('Usuário já fez a confirmação');

  //   return this.prisma.request_admin_access.create({
  //     data: {
  //       ...validate,
  //       email: validate.email.toLocaleLowerCase(),
  //     },
  //   });
  // }
}
