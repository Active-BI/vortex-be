import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ResetPassTempToken, TempToken, Token } from 'src/helpers/token';
import * as bcrypt from 'bcrypt';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
//import { UserAuthService } from '../user_auth/user_auth.service';
import { User_Auth } from '@prisma/client';
import { PagesMasterService } from 'src/master/pages/pages.service';
import { UserService } from 'src/admin/user/user.service';
import { SmtpService } from 'src/services/smtp.service';
import { message_book } from 'src/services/email_book';
import { randomUUID } from 'crypto';
import { CreateLoginDto } from './DTOs/CreateLoginDto';
import { PageService } from 'src/admin/pages/page.service';
import { UserAuthService } from '../auth_service/user_auth.service';
var speakeasy = require('speakeasy');

@Injectable()
export class LoginService {
  constructor(
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private pagesMasterService: PagesMasterService,
    private smtpService: SmtpService,

    //
    // private loginRepository: LoginRepository,
    private pageService: PageService,
  ) {}
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

  async TFA(login: CreateLoginDto) {
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

  async generateTempToken(user: User_Auth) {
    const tokenObj = new TempToken(user.normalized_contact_email.toLowerCase());
    var token = await this.jwtStrategy.signTempToken(tokenObj);

    return token;
  }
  async generateToken(user: User_Auth) {
    const userToToken = await this.userService.getUser(
      user.normalized_contact_email.toLowerCase(),
    );
    const tokenObj = new Token(userToToken, []);

    var token = await this.jwtStrategy.signToken(tokenObj);

    await this.setLastAccess(user);

    return token;
  }
  async getUserAuth(login) {
    const user = await this.userAuthService.getUserAuth(login.email);
    if (!user) throw new BadRequestException('Usuário não existe');
    return user;
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
  async checkPass(login: CreateLoginDto) {
    const user_auth = await this.getUserAuth(login);

    const isHash = await bcrypt.compare(
      login.password,
      user_auth.password_hash,
    );

    if (!isHash) throw new ForbiddenException('Senha inválida');

    const tokenObj = new Token(user_auth.User, []);

    var token = await this.jwtStrategy.signToken(tokenObj);

    delete user_auth.User;
    await this.setLastAccess(user_auth as User_Auth);

    return { token };
  }
  async checkPassMaster(login: CreateLoginDto) {
    const user_auth = await this.getUserAuth(login);

    const isHashTrue = await bcrypt.compare(
      login.password,
      user_auth.password_hash,
    );

    if (!isHashTrue) throw new ForbiddenException('Senha inválida');

    const dashboardUser = await this.pagesMasterService.getAllPageMaster();
    const tokenObj = new Token(user_auth.User, dashboardUser);

    var token = await this.jwtStrategy.signToken(tokenObj);

    delete user_auth.User;
    await this.setLastAccess(user_auth as User_Auth);
    return token;
  }
  setLastAccess(user: User_Auth) {
    this.userAuthService.update({ ...user, last_access: new Date() });
  }

  async register(login: CreateLoginDto) {
    const user = await this.userAuthService.getUserAuth(login.email);
    if (!user) {
      throw new UnauthorizedException('Usuário não está pré-cadastrado');
    }

    if (user.password_hash && user.password_hash.length > 0) {
      throw new UnauthorizedException('Usuário já foi cadastrado');
    }

    const passwordHash = bcrypt.hashSync(login.password, 10);
    this.userAuthService.update({ ...user, password_hash: passwordHash });
  }

  async resetPass(email) {
    let user = await this.userAuthService.getUserAuth(email);

    if (!user) throw new Error('Email não cadastrado');
    const { User, ...args } = user;
    const secretToReset = randomUUID();
    const userResp = { ...args, reset_pass: secretToReset } as User_Auth;

    await this.userAuthService.update(userResp);

    const tokenObj = new ResetPassTempToken(email, secretToReset);
    var token = await this.jwtStrategy.signConfirmRequest(tokenObj);
    const link = `${process.env['FRONT_BASE_URL']}/#/auth/reset-password/${token}`;

    await this.smtpService.renderMessage(
      message_book.auth.email_to_reset_pass(link),
      [email],
    );
  }

  async setNewPass({ password, token }) {
    const decodedToken: { email: string; reset_pass: string } =
      await this.jwtStrategy.validate(token);
    let { User, ...userAuth } = await this.userAuthService.getUserAuth(
      decodedToken.email,
    );

    if (userAuth.reset_pass !== decodedToken.reset_pass) {
      throw new UnauthorizedException('Link já utilidado');
    }
    const password_hash = bcrypt.hashSync(password, 10);

    const userResp = {
      ...userAuth,
      reset_pass: '',
      password_hash,
    } as User_Auth;

    await this.userAuthService.update(userResp);
    return;
  }

  async verifyTFA(user, _token, pin) {
    try {
      const validPin = await this.verifyPin(_token, pin);
      if (!validPin) throw new Error('Pin inválido');
      return await this.generateToken(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    //
  }

  async loginTFA(email, _token, pin) {
    const user = await this.getUserAuth({
      email,
    });
    const token = await this.verifyTFA(user, _token, pin);
    return await this.userGetConfig(user, token);
  }

  async userGetConfig(user, token) {
    const userRoutes = await this.pageService.getAllPagesByUser(
      user.User.id,
      user.User.tenant_id,
    );
    return {
      token,
      tenant_id: user.User.tenant_id,
      app_image: user.User.Tenant.tenant_image,
      tenant_image: user.User.Tenant.tenant_image,
      tenant_color: user.User.Tenant.tenant_color,
      user_email: user.User.contact_email,
      userRoutes,
    };
  }

  async login(body: CreateLoginDto) {
    try {
      const user_auth = await this.getUserAuth(body);
      if (user_auth.User.Rls.name === 'Master') {
        const token = await this.checkPassMaster(body);
        const userRoutes = await this.pageService.getAllPagesByUser(
          user_auth.User.id,
          user_auth.User.tenant_id,
        );
        return { token, userRoutes, pass: true };
      }
      const token = await this.TFA(body);

      return { token };
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
