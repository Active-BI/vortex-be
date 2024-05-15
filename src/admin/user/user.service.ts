import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserAuthService } from 'src/auth/user_auth/user_auth.service';
import { EditUserBody, UserResponse } from './DTOS';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { SmtpService } from 'src/services/smtp.service';
import { message_book } from 'src/services/email_book';
import { UserRepository } from './userRepository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
    private smtpService: SmtpService,
  ) {}
  async findAll(tenant_id: string): Promise<UserResponse[]> {
    return await this.userRepository.findAll(tenant_id)
  }

  async findById(userId, tenant_id: string): Promise<UserResponse> {
    return await this.userRepository.findById(userId,tenant_id)
  }

  async UpdateUSer(user: EditUserBody): Promise<UserResponse> {
    await this.userRepository.UpdateUSer(user)

    return await this.findById(user.id, user.tenant_id);
  }

  async createUser(user, tenant_id: string): Promise<{ user_id: string }> {
    await this.userRepository.createUser(user, tenant_id)
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
      message_book.auth.request_new_sign_up(token,userEmail),
      [userEmail],
    );
  }
  async getUser(email: string): Promise<UserResponse> {
    return await this.userRepository.getUser(email)
  }

  async deleteUser(id: string) {
    await await this.userRepository.deleteUser(id)
  }
}
