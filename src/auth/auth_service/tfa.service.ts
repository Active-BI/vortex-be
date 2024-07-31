import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User_Auth } from '@prisma/client';
import { UserAuthService } from './user_auth.service';
import { SmtpService } from 'src/services/smtp.service';
import { message_book } from 'src/services/email_book';
import { CreateLoginDto } from '../login/DTOs/CreateLoginDto';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { TempToken, Token } from 'src/helpers/token';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/admin/user/user.service';
import { PageService } from 'src/admin/pages/page.service';

var speakeasy = require('speakeasy');

@Injectable()
export class TfaService {
  constructor(
    private userAuthService: UserAuthService,
    private smtpService: SmtpService,
    private jwtStrategy: JwtStrategy,
    private userService: UserService,
    private pageService: PageService,
  ) {}

  async getUserAuth(login) {
    const user = await this.userAuthService.getUserAuth(login.email);
    if (!user) throw new BadRequestException('Usuário não existe');
    return user;
  }

  async generateTempToken(user: User_Auth) {
    const tokenObj = new TempToken(user.normalized_contact_email.toLowerCase());
    var token = await this.jwtStrategy.signTempToken(tokenObj);

    return token;
  }

  async generateTotp(user: User_Auth) {
    var secret = speakeasy.generateSecret({ length: 10 });

    let userUpdate: User_Auth = { ...user, secret: secret.base32 };

    await this.userAuthService.update(userUpdate);

    const totp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      period: 300,
      window: 10,
    });
    await this.smtpService.renderMessage(
      message_book.auth.security_login(totp),
      [userUpdate.normalized_contact_email.toLocaleLowerCase()],
    );
    return totp;
  }
  async generateToken(user: User_Auth) {
    const userToToken = await this.userService.getUser(
      user.normalized_contact_email.toLowerCase(),
    );
    const tokenObj = new Token(userToToken, []);

    var token = await this.jwtStrategy.signToken(tokenObj);

    await this.userAuthService.update({ ...user, last_access: new Date() });

    return token;
  }

  async verifyPin(token, pin) {
    const decodedToken: any = await this.jwtStrategy.verifyTempToken(token);
    const user = await this.userAuthService.getUserAuth(decodedToken.email);
    var verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: pin,
      window: 10,
    });
    return verified;
  }

  async CheckUserCredentialsToGenerateTFACodeAndTempToken(login: CreateLoginDto) {
    const user_auth = await this.getUserAuth(login);

    const isHash = await bcrypt.compare(
      login.password,
      user_auth.password_hash,
    );

    if (!isHash) throw new ForbiddenException('Senha inválida');

    delete user_auth.User;

    if (!isHash) throw new ForbiddenException('Senha inválida');

    await this.generateTotp(user_auth);
    return await this.generateTempToken(user_auth);
  }

  async verifyTFA(user, _token, pin) {
    try {
      const validPin = await this.verifyPin(_token, pin);
      if (!validPin) throw new Error('Pin inválido');
      return await this.generateToken(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async loginTFA(email, _token, pin) {
    const user = await this.getUserAuth({
      email,
    });
    const token = await this.verifyTFA(user, _token, pin);
    return await this.userGetConfig(user, token);
  }

  async userGetConfig(user, token) {
    return {
      token,
      tenant_id: user.User.tenant_id,
      // app_image: user.User.Tenant.tenant_image,
      // tenant_image: user.User.Tenant.tenant_image,
      // tenant_color: user.User.Tenant.tenant_color,
      user_email: user.User.contact_email,
    };
  }
}
