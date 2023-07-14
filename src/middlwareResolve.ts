import { MiddlewareConsumer } from '@nestjs/common';
import { ValidateLoginMiddleware } from './auth/login/check-params';
import { LoginController } from './auth/login/login.controller';

export function MiddlewareResolver(consumer: MiddlewareConsumer) {
  consumer.apply(ValidateLoginMiddleware).forRoutes(LoginController);
}
