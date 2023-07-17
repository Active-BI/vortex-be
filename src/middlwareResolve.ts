import { MiddlewareConsumer } from '@nestjs/common';
import { ValidateLoginMiddleware } from './auth/login/check-params';
import { LoginController } from './auth/login/login.controller';
import { TokenValidationMiddleware } from './middlewares/tokenValidation.middleware';

export function MiddlewareResolver(consumer: MiddlewareConsumer) {
  consumer.apply(TokenValidationMiddleware).forRoutes('*');
  consumer.apply(ValidateLoginMiddleware).forRoutes(LoginController);
}
