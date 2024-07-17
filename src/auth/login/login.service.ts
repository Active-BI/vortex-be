import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ResetPassTempToken, TempToken, Token } from 'src/helpers/token';
import * as bcrypt from 'bcrypt';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { User_Auth } from '@prisma/client';
import { PagesMasterService } from 'src/master/pages/pages.service';
import { SmtpService } from 'src/services/smtp.service';
import { message_book } from 'src/services/email_book';
import { randomUUID } from 'crypto';
import { CreateLoginDto } from './DTOs/CreateLoginDto';
import { PageService } from 'src/admin/pages/page.service';
import { UserAuthService } from '../auth_service/user_auth.service';
import { TfaService } from '../auth_service/tfa.service';
import { PrismaService } from 'src/services/prisma.service';
var speakeasy = require('speakeasy');

@Injectable()
export class LoginService {
  constructor(
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
    private pagesMasterService: PagesMasterService,
    private smtpService: SmtpService,
    private tfaService: TfaService,
    private pageService: PageService,
    private prisma: PrismaService,
  ) {}
  async getUserAuth(login) {
    const user = await this.userAuthService.getUserAuth(login.email);
    if (!user) throw new BadRequestException('Usuário não existe');
    return user;
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

  async login(body: CreateLoginDto) {
    try {
      const user_auth = await this.getUserAuth(body);
      if (user_auth.User.Rls.name === 'Master') {
        const token = await this.checkPassMaster(body);
        const userRoutes = await this.pageService.getAllPagesByUser(
          user_auth.User.id,
          user_auth.User.tenant_id,
        );
        return { token, userRoutes, passThrough: true };
      }
      const token = await this.tfaService.TFA(body);

      return { token };
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async getPageImage() {
    return await this.prisma.app.findFirst({
      where: {
        id: 'd25bd198-782b-486f-a9b2-d8a288ab3673',
      },
    });
  }
}
