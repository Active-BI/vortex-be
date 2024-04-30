import { MiddlewareConsumer } from '@nestjs/common';
import { ValidateLoginMiddleware } from './auth/login/check-params';
import { LoginController } from './auth/login/login.controller';
import { TokenValidationMiddleware } from './middlewares/tokenValidation.middleware';
import { ValidateAdminRequestMiddleware } from './master/master-request/check-params';
import { MasterRequestController } from './master/master-request/admin-request.controller';
import { ValidateUserAdminMiddleware } from './admin/user/check-params';
import { UserController } from './admin/user/user.controller';
import { TenantsController } from './master/tenants/tenants.controller';
import { ValidateProjectsMiddleware } from './master/tenants/projectsMiddleware';

export function MiddlewareResolver(consumer: MiddlewareConsumer) {
  consumer.apply(TokenValidationMiddleware).forRoutes('*');
  consumer.apply(ValidateLoginMiddleware).forRoutes(LoginController);
  consumer.apply(ValidateUserAdminMiddleware).forRoutes(UserController);
  consumer
    .apply(ValidateAdminRequestMiddleware)
    .forRoutes(MasterRequestController);

  consumer.apply(ValidateProjectsMiddleware).forRoutes(TenantsController);

}
