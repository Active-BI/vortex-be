import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAuthService } from '../user_auth/user_auth.service';
import { NextFunction } from 'express';

interface Request {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  body: {
    email: string;
    password: string;
  };
}
@Injectable()
export class ValidateLoginMiddleware implements NestMiddleware {
  constructor(private userAuthService: UserAuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'POST') {
      try {
        const user = await this.userAuthService.getUserAuth(req.body.email);
        console.log(user);
        if (user === null) throw Error('Usuário Inválido');
        if (user.User === null) throw Error('Usuário Inativo');
      } catch (e) {
        throw new UnauthorizedException({
          message: `${e.message}`,
          errorType: `${e.message}`,
          statusCode: 401,
          error: 'Bad Request',
        });
      }
      try {
        const isOnPreRegister = await this.userAuthService.getUserAuth(
          req.body.email,
        );
        if (!isOnPreRegister) throw new Error('Usuário sem pré-cadastro');
      } catch (e) {
        throw new BadRequestException({
          message: `dados inválidos`,
          errorType: `${e.message}`,
          statusCode: 400,
          error: 'Bad Request',
        });
      }
    }
  }
}
