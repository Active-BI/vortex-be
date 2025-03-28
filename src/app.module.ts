import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './helpers/strategy/jwtStrategy.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './helpers/strategy/jwtGuard.service';
import { LoginService } from './auth/login/login.service';
import { LoginController } from './auth/login/login.controller';
import { RoleGuard } from './helpers/strategy/jwtCheckRole.service';
import { ConfigModule } from '@nestjs/config';
import { UserAuthService } from './auth/auth_service/user_auth.service';
import { PrismaService } from 'src/services/prisma.service';
import { MiddlewareResolver } from './middlwareResolve';
import { UserService } from './admin/user/user.service';
import { UserController } from './admin/user/user.controller';
import { PbiReportController } from './admin/pbi-report/pbi-report.controller';
import { PbiReportService } from './admin/pbi-report/pbi-report.service';
import { MsalService } from './services/msal.service';
import { PageController } from './admin/pages/page.controller';
import { PageService } from './admin/pages/page.service';
import { TemplateHandlerService } from './services/templateHandler.service';
import { TenantsService } from './master/tenants/tenants.service';
import { TenantsController } from './master/tenants/tenants.controller';
import { RolesGuard } from './helpers/roleDecorator/roles.guard';
import { PagesMasterService } from './master/pages/pages.service';
import { PagesMasterController } from './master/pages/pages.controller';
import { SmtpService } from './services/smtp.service';
import { GroupsController } from './master/groups/groups.controller';
import { GroupsService } from './master/groups/groups.service';
import { OfficeController } from './admin/office/office.controller';
import { OfficeService } from './admin/office/office.service';
import { WebsocketTestGateway } from './websocket-test/websocket-test.gateway';
import { SocketSessionService } from './websocket-test/serviceSocket';
import { SocketController } from './admin/socket/socket.controller';
import { SocketService } from './admin/socket/socket.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import SessionRepository from './core/session/repository';
import { AppConfigController } from './master/app-config/app-config.controller';
import { AppConfigService } from './master/app-config/app-config.service';
import { TreinamentosModule } from './admin/treinamentos/treinamentos.module';
import { DocumentsModule } from './master/documents/documents.module';
import { UserRepository } from './admin/user/userRepository';
import { TfaService } from './auth/auth_service/tfa.service';
import { TenantSetupModule } from './auth/tenant-setup/tenant-setup.module';

let providers: any = [
  AppConfigService,
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
  PageService,
  TemplateHandlerService,
  TenantsService,
  PagesMasterService,
  SmtpService,
  GroupsService,
  OfficeService,
  SocketSessionService,
  SocketService,
  SessionRepository,
  UserRepository,
  TfaService,PbiReportController
];

if (process.env['NODE_ENV'] === 'production') {
  providers = [...providers, WebsocketTestGateway];
}
@Module({
  controllers: [
    AppController,
    LoginController,
    UserController,
    PbiReportController,
    PageController,
    TenantsController,
    PagesMasterController,
    GroupsController,
    OfficeController,
    SocketController,
    AppConfigController,
  ],
  providers,
  exports: [JwtStrategy],
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TreinamentosModule,
    DocumentsModule,
    TenantSetupModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareResolver(consumer);
  }
}
