import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { CreateUserBody } from './Swagger';
import { UserService } from './user.service';
import { UserAuthService } from 'src/auth/user_auth/user_auth.service';
const Joi = require('Joi');

interface Requestq extends Request {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  body: CreateUserBody;
  tokenData: { tenant_id: string };
}
@Injectable()
export class ValidateUserAdminMiddleware implements NestMiddleware {
  constructor(private userAuthService: UserAuthService) {}
  async use(req: Requestq, res: Response, next: NextFunction) {
    if (req.method === 'PUT') {
      try {
        const schema = Joi.object({
          id: Joi.string().required(),
          name: Joi.string().min(3).required(),
          profession: Joi.string().required(),
          description: Joi.string().required(),
          rls_id: Joi.string().required(),
        });
        await schema.validateAsync(req.body);
      } catch (e) {
        throw new BadRequestException({
          message: `dados inválidos`,
          errorType: 'Campos Inválidos',
          statusCode: 400,
          error: 'Bad Request',
        });
      }
    }
    if (req.method === 'POST') {
      try {
        const schema = Joi.object({
          name: Joi.string().min(3).required(),
          email: Joi.string().email().lowercase().required(),
          profession: Joi.string().required(),
          description: Joi.string().required(),
          rls_id: Joi.string().required(),
        });
        await schema.validateAsync(req.body);
      } catch (e) {
        throw new BadRequestException({
          message: `dados inválidos`,
          errorType: 'Campos Inválidos',
          statusCode: 400,
          error: 'Bad Request',
        });
      }
      const findUser = await this.userAuthService.getUserAuth(req.body.email);
      if (findUser) {
        throw new BadRequestException('Esse usuário já foi cadastrado');
      }
    }

    next();
  }
}
