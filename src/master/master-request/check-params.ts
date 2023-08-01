import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { UserAuthService } from 'src/auth/user_auth/user_auth.service';
const Joi = require('joi');

interface Requestb extends Request {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  body: {
    description: string;
    profession: string;
    company_description: string;
    company_name: string;
    company_cnpj: string;
    email: string;
    name: string;
  };
}
@Injectable()
export class ValidateAdminRequestMiddleware implements NestMiddleware {
  constructor(private userAuthService: UserAuthService) {}
  async use(req: Requestb, res: Response, next: NextFunction) {
    console.log(req.path);
    if (
      req.method === 'POST' &&
      !req.path.includes('accept-and-create-tenant')
    ) {
      try {
        const schema = Joi.object({
          name: Joi.string().alphanum().min(3).required(),
          company_name: Joi.string().alphanum().min(3).required(),
          company_cnpj: Joi.string().alphanum().min(3).required(),
          company_description: Joi.string().alphanum().min(3).required(),
          description: Joi.string().alphanum().min(3).required(),
          profession: Joi.string().alphanum().min(3).required(),
          email: Joi.string().email().lowercase().required(),
        });
        await schema.validateAsync(req.body);
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
