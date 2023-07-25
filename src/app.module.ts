import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './helpers/strategy/jwtStrategy.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './helpers/strategy/jwtGuard.service';
import { LoginService } from './auth/login/login.service';
import { LoginController } from './auth/login/login.controller';
import { RoleGuard } from './helpers/strategy/jwtCheckRole.service';
import { ConfigModule } from '@nestjs/config';
import { UserAuthController } from './auth/user_auth/user_auth.controller';
import { UserAuthService } from './auth/user_auth/user_auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { MiddlewareResolver } from './middlwareResolve';
import { UserService } from './app/user/user.service';
import { UserController } from './app/user/user.controller';
import { PbiReportController } from './app/pbi-report/pbi-report.controller';
import { PbiReportService } from './app/pbi-report/pbi-report.service';
import { MsalService } from './services/msal.service';
import { ArquivosController } from './app/arquivos/arquivos.controller';
import { ArquivosService } from './app/arquivos/arquivos.service';
import { DashboardController } from './app/dashboard/dashboard.controller';
import { DashboardService } from './app/dashboard/dashboard.service';
import { TemplateHandlerService } from './services/templateHandler.service';
import { DashboardsModule } from './master/dashboards/dashboards.module';
import { TenantsService } from './master/tenants/tenants.service';
import { TenantsController } from './master/tenants/tenants.controller';
import { RolesGuard } from './helpers/roleDecorator/roles.guard';
import { AdminRequestService } from './auth/admin-request/admin-request.service';
import { AdminRequestController } from './auth/admin-request/admin-request.controller';

@Module({
  controllers: [
    AppController,
    LoginController,
    UserAuthController,
    UserController,
    PbiReportController,
    ArquivosController,
    DashboardController,
    TenantsController,
    AdminRequestController,
  ],
  providers: [
    PrismaService,
    AppService,
    JwtStrategy,
    JwtService,
    { provide: APP_GUARD, useClass: JwtGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RoleGuard,
    JwtGuard,
    LoginService,
    UserAuthService,
    UserService,
    PbiReportService,
    MsalService,
    ArquivosService,
    DashboardService,
    TemplateHandlerService,
    TenantsService,
    AdminRequestService,
  ],
  exports: [JwtStrategy],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DashboardsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareResolver(consumer);
  }
}
