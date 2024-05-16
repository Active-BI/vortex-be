import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserAuthService } from 'src/auth/user_auth/user_auth.service';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { SmtpService } from 'src/services/smtp.service';
import { message_book } from 'src/services/email_book';
import { ICreateUser, UserRepository } from './userRepository';
import { randomUUID } from 'crypto';
import { EditUserBody } from './dto/EditUserDto';
import { UserResponse } from './dto/UserResponseDto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
    private smtpService: SmtpService,
  ) {}
  async findAll(tenant_id: string): Promise<UserResponse[]> {
    return await this.userRepository.findAll(tenant_id);
  }

  async findById(userId, tenant_id: string): Promise<UserResponse> {
    return await this.userRepository.findById(userId, tenant_id);
  }

  async UpdateUSer(
    user: EditUserBody,
    tenant_id: string,
  ): Promise<UserResponse> {
    await this.userRepository.UpdateUSer(user);

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
}
