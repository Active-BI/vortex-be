import { MiddlewareConsumer } from '@nestjs/common';
//import { ValidateLoginMiddleware } from './auth/login/check-params';
import { TokenValidationMiddleware } from './middlewares/tokenValidation.middleware';
import { TenantsController } from './master/tenants/tenants.controller';
import { ValidateProjectsMiddleware } from './master/tenants/projectsMiddleware';

export function MiddlewareResolver(consumer: MiddlewareConsumer) {
  consumer.apply(TokenValidationMiddleware).forRoutes('*');
  consumer.apply(ValidateProjectsMiddleware).forRoutes(TenantsController);
}
