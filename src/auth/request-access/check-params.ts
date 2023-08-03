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
    if (req.method === 'POST') {
      try {
        const schema = Joi.object({
          company_description: Joi.string().required(),
          company_name: Joi.string().required(),
          company_cnpj: Joi.string().required(),
          email: Joi.string().email().lowercase().required(),
          name: Joi.string().required(),
          description: Joi.string(),
          profession: Joi.string().required(),
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
