import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { UserAuthService } from 'src/auth/auth_service/user_auth.service';
import * as Joi from 'joi';

@Injectable()
export class ValidateProjectsMiddleware implements NestMiddleware {
  constructor(private userAuthService: UserAuthService) {}
  async use(req, res: Response, next: NextFunction) {
    // if (req.method === 'POST') {
    //     try {
    //         const schema = Joi.array().items(
    //             Joi.object({
    //                 id: Joi.string().min(3).required(),
    //                 projeto: Joi.string().min(3).required(),
    //                 cliente: Joi.string().min(3).required(),
    //             })
    //         )
    //             await schema.validateAsync(req.body);

    //     } catch (e) {
    //         console.log(e)
    //         throw new BadRequestException({
    //             message: `dados inválidos`,
    //             errorType: 'Campos Inválidos',
    //             statusCode: 400,
    //             error: 'Bad Request',
    //         });
    //     }
    // }

    next();
  }
}
