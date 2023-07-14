import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Token } from 'src/helpers/token';
import * as bcrypt from 'bcrypt';
import { CreateLoginDto } from './login.controller';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';

@Injectable()
export class LoginService {
  constructor(private jwtStrategy: JwtStrategy) {}

  async getUser(login) {
    // const user: any = await this.userService.findOneByEmail(login.email);
    // if (!user) throw new BadRequestException('Usuário não existe');
    // return {
    //   ...user,
    // };
    return;
  }

  async checkPass(login: CreateLoginDto) {
    const user: any = await this.getUser(login);

    const isHashTrue = await bcrypt.compare(login.password, user.password_hash);

    if (!isHashTrue) throw new ForbiddenException('Senha inválida');

    const tokenObj = new Token(
      user.id,
      user.name,
      user.email,
      user.status,
      user.Pre_register.Role.id,
      user.Pre_register.Role.name,
      user.Pre_register.tenant_id,
    );

    var token = await this.jwtStrategy.signToken(tokenObj);

    delete user.Pre_register;
    await this.setLastAccess(user as any);

    return { token };
  }
  setLastAccess(user: any) {
    // this.userService.update({ ...user, last_access: new Date() });
  }
}
