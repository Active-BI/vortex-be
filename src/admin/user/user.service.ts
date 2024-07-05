import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserAuthService } from 'src/auth/auth_service/user_auth.service';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { SmtpService } from 'src/services/smtp.service';
import { message_book } from 'src/services/email_book';
import { ICreateUser, UserRepository } from './userRepository';
import { randomUUID } from 'crypto';
import { EditUserBody } from './dto/EditUserDto';
import { UserResponse } from './dto/UserResponseDto';
import { PagesMasterService } from 'src/master/pages/pages.service';
import { roles } from 'prisma/seedHelp';
import { async } from 'rxjs';
import { PbiReportController } from '../pbi-report/pbi-report.controller';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private pagesMasterService: PagesMasterService,
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
    private smtpService: SmtpService,
    private prisma: PrismaService,
    private pbiReportController: PbiReportController
  ) {}
  async findAll(tenant_id: string): Promise<UserResponse[]> {
    return await this.userRepository.findAll(tenant_id);
  }

  async findById(userId, tenant_id: string): Promise<UserResponse> {
    return await this.userRepository.findById(userId, tenant_id);
  }

  async UpdateUser(
    user: EditUserBody,
    tenant_id: string,
    tokenData: any
  ): Promise<UserResponse> {
    await this.userRepository.UpdateUSer(user);

    const allReports = await (await this.pagesMasterService.findAllByTenant(tenant_id)).filter(p => p.page_type === 'report')
    console.log(allReports)
    try {
      await Promise.all([await allReports.forEach( async (report) => {
        await this.pbiReportController.refreshDataset(report.formated_title, report.Page_Group.formated_title, {tokenData})
      })])
    } catch (error) {
      console.log('Falha ao atualizar relatório');
    }

    return await this.findById(user.id, tenant_id);
  }

  async createUser(user: ICreateUser, tenant_id: string): Promise<ICreateUser> {
    const uuid = randomUUID();
    user['id'] = uuid;

    await this.userRepository.createUser(user, tenant_id);
    await this.userAuthService.createAuthUser(user.email, user.id);

    await this.createTransportEmail(user.email, user.id, user.email);

    return user;
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
      message_book.auth.request_new_sign_up(token, userEmail),
      [userEmail],
    );
  }
  async getUser(email: string): Promise<UserResponse> {
    return await this.userRepository.getUser(email);
  }

  async deleteUser(id: string) {
    await await this.userRepository.deleteUser(id);
  }

    async postTenantAndUser(body, tenant_id) {
    const alreadyExists = await this.getUser(body.email);
    if (alreadyExists) {
      throw new BadRequestException('Email já está em uso');
    }
    let uuid = randomUUID();

    await this.acceptRequestAccess(body.email, uuid);

    const { id } = await this.createUser(
      { email: body.email, name: body.name , id: uuid, rls_id: roles[1].id, projects: body.projetos,office_id: body.office_id },
      tenant_id,
    );

    // TODO: criar um repository em pages para esse trecho
    const tenantsDisponiveis = await this.prisma.tenant_Page.findMany({
      where: { tenant_id },
    });

    await this.prisma.user_Page.createMany({
      data: tenantsDisponiveis.map((td) => ({
        user_id: id,
        tenant_page_id: td.id,
      })),
    });
  }
}
