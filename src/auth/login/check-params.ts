import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAuthService } from '../user_auth/user_auth.service';
import { NextFunction, Request } from 'express';
import * as Joi from 'joi';

interface Requestq extends Request {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  body: {
    email: string;
    password: string;
  };
}
@Injectable()
export class ValidateLoginMiddleware implements NestMiddleware {
  constructor(private userAuthService: UserAuthService) {}
  async use(req: Requestq, res: Response, next: NextFunction) {
    if (req.method === 'POST' && req.path.includes('register')) {
      try {
        const schema = Joi.object({
          password: Joi.string()
            .min(6)
            .pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{2,}$/,
            )
            .required(),
          email: Joi.string().email().lowercase().required(),
        });
        await schema.validateAsync(req.body);
      } catch (e) {
        throw new BadRequestException({
          message: `dados inválidos`,
          errorType: `Email ou senha inválidos`,
          statusCode: 400,
          error: 'Bad Request',
        });
      }
    }
    if (req.method === 'POST' && !req.path.includes('register')) {
      console.log(Joi);
      try {
        const schema = Joi.object({
          password: Joi.string()
            .min(6)
            .pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{2,}$/,
            )
            .required(),
          email: Joi.string().email().lowercase().required(),
        });
        await schema.validateAsync(req.body);
      } catch (e) {
        throw new BadRequestException({
          message: `dados inválidos`,
          errorType: `Email ou senha inválidos`,
          statusCode: 400,
          error: 'Bad Request',
        });
      }
      try {
        const user = await this.userAuthService.getUserAuth(req.body.email);
        if (user === null) throw new Error('Usuário sem pré-cadastro');
        if (user.User === null) throw Error('Usuário Inativo');
      } catch (e) {
        throw new UnauthorizedException({
          message: `${e.message}`,
          errorType: `${e.message}`,
          statusCode: 401,
          error: 'Bad Request',
        });
      }
    }
    next();
  }
}
