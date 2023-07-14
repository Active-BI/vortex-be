import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Token } from 'src/helpers/token';
import * as bcrypt from 'bcrypt';
import { CreateLoginDto } from './login.controller';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';
import { UserAuthService } from '../user_auth/user_auth.service';
import { User_Auth } from '@prisma/client';

@Injectable()
export class LoginService {
  constructor(
    private jwtStrategy: JwtStrategy,
    private userAuthService: UserAuthService,
  ) {}

  async getUser(login) {
    const user = await this.userAuthService.getUserAuth(login.email);
    if (!user) throw new BadRequestException('Usuário não existe');
    return user;
  }

  async checkPass(login: CreateLoginDto) {
    const user = await this.getUser(login);

    const isHashTrue = await bcrypt.compare(login.password, user.password_hash);

    if (!isHashTrue) throw new ForbiddenException('Senha inválida');

    const tokenObj = new Token(
      user.id,
      user.name,
      user.contact_email,
      user.personal_email,
      user.User.Rls,
      user.User.tenant_id,
    );

    var token = await this.jwtStrategy.signToken(tokenObj);

    delete user.User;
    await this.setLastAccess(user as User_Auth);

    return { token };
  }
  setLastAccess(user: User_Auth) {
    this.userAuthService.update({ ...user, last_access: new Date() });
  }
}
