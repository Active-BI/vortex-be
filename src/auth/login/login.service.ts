import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Token } from 'src/helpers/token';
import * as bcrypt from 'bcrypt';
import { CreateLoginDto } from './Swagger';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { UserAuthService } from '../user_auth/user_auth.service';
import { User_Auth } from '@prisma/client';
import { DashboardService } from 'src/admin/dashboard/dashboard.service';
import { DashboardsMasterService } from 'src/master/dashboards/dashboards.service';

@Injectable()
export class LoginService {
  constructor(
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
    private dashboardService: DashboardService,
    private dashboardMasterService: DashboardsMasterService,
  ) {}

  async getUserAuth(login) {
    const user = await this.userAuthService.getUserAuth(login.email);
    if (!user) throw new BadRequestException('Usuário não existe');
    return user;
  }

  async checkPass(login: CreateLoginDto) {
    const user_auth = await this.getUserAuth(login);

    const isHashTrue = await bcrypt.compare(
      login.password,
      user_auth.password_hash,
    );

    if (!isHashTrue) throw new ForbiddenException('Senha inválida');

    const dashboardUser = await this.dashboardService.getAllDashboardsByUser(
      user_auth.User.id,
      user_auth.User.tenant_id,
    );

    const tokenObj = new Token(user_auth.User, dashboardUser);

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
    console.log(token);
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
