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

    const tokenObj = new Token(
      user_auth.User.id,
      user_auth.User.name,
      user_auth.User.contact_email,
      user_auth.User.personal_email,
      user_auth.User.Rls,
      user_auth.User.tenant_id,
    );

    var token = await this.jwtStrategy.signToken(tokenObj);

    delete user_auth.User;
    await this.setLastAccess(user_auth as User_Auth);

    return { token };
  }
  setLastAccess(user: User_Auth) {
    this.userAuthService.update({ ...user, last_access: new Date() });
  }
}
