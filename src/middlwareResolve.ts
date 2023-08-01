import { MiddlewareConsumer } from '@nestjs/common';
import { ValidateLoginMiddleware } from './auth/login/check-params';
import { LoginController } from './auth/login/login.controller';
import { TokenValidationMiddleware } from './middlewares/tokenValidation.middleware';
import { ValidateAdminRequestMiddleware } from './auth/admin-request/check-params';
import { AdminRequest } from './auth/admin-request/entities/admin-request.entity';
import { AdminRequestController } from './auth/admin-request/admin-request.controller';

export function MiddlewareResolver(consumer: MiddlewareConsumer) {
  consumer.apply(TokenValidationMiddleware).forRoutes('*');
  consumer.apply(ValidateLoginMiddleware).forRoutes(LoginController);
  consumer
    .apply(ValidateAdminRequestMiddleware)
    .forRoutes(AdminRequestController);
}
