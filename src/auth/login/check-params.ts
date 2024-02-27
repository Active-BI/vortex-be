import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAuthService } from '../user_auth/user_auth.service';
import { NextFunction, Request } from 'express';
import * as Joi from 'joi';
const method = (value, helpers) => {
  if (!value.match(/^[a-zA-Z0-9\s]*$/)) {
    return new Error('Falta um caractere especial a sua senha');
  }
  if (!/[A-Z]/.test(value as string)) {
    return new Error('Falta uma letra maiúpscula a sua senha');
  }
  return value; // Return the value unchanged
};

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
            .custom(method, 'Validar patterns')
            .required(),
          email: Joi.string().email().required(),
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
    if (
      req.method === 'POST' &&
      !req.path.includes('register') &&
      !req.path.includes('tfa') && 
      !req.path.includes('set-new-pass')
    ) {
      try {
        const schema = Joi.object({
          password: Joi.string()
            .min(6)
            .custom(method, 'Validar patterns')
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
