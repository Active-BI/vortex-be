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

@Module({
  controllers: [AppController, LoginController, UserAuthController],
  providers: [
    PrismaService,
    AppService,
    JwtStrategy,
    JwtService,
    { provide: APP_GUARD, useClass: JwtGuard },
    RoleGuard,
    JwtGuard,
    LoginService,
    UserAuthService,
  ],
  exports: [JwtStrategy],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MiddlewareResolver(consumer);
  }
}
