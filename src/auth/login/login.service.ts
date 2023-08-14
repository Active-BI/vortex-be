import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TempToken, Token } from 'src/helpers/token';
import * as bcrypt from 'bcrypt';
import { CreateLoginDto } from './Swagger';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { UserAuthService } from '../user_auth/user_auth.service';
import { User, User_Auth, User_AuthPayload } from '@prisma/client';
import { PageService } from 'src/admin/pages/page.service';
import { DashboardsMasterService } from 'src/master/dashboards/dashboards.service';
import { htmlLogin } from './helper';
import { UserService } from 'src/admin/user/user.service';
import { UserResponse } from 'src/admin/user/Swagger';
var speakeasy = require('speakeasy');
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
    user: 'embedded@activebi.com.br',
    pass: 'Paq21687',
  },
});
@Injectable()
export class LoginService {
  constructor(
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private dashboardMasterService: DashboardsMasterService,
  ) {}
  async createTransportEmail(userEmail, totp) {
    try {
      await transporter.sendMail({
        from: 'embedded@activebi.com.br', // sender address
        to: userEmail, // list of receivers
        subject: 'Código de Acesso', // Subject line
        text: totp, // plain text body
        html: htmlLogin(totp),
      });
    } catch (e) {
      console.log(e);
    }
  }
  async generateTotp(user: User_Auth) {
    var secret = speakeasy.generateSecret({ length: 10 });

    let userUpdate: User_Auth = { ...user, secret: secret.base32 };

    await this.userAuthService.update(userUpdate);

    const tokenTotp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      period: 300,
      window: 10,
    });
    this.createTransportEmail(
      user.normalized_contact_email.toLowerCase(),
      tokenTotp,
    );
    return tokenTotp;
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
    const decodedToken: any = await this.jwtStrategy.validate(token);
    console.log(decodedToken);
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

    const dashboardUser =
      await this.dashboardMasterService.getAllDashboardsMaster();
    const tokenObj = new Token(user_auth.User, dashboardUser);

    var token = await this.jwtStrategy.signToken(tokenObj);

    delete user_auth.User;
    await this.setLastAccess(user_auth as User_Auth);
    return { token };
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
}
