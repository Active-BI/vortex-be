import { Module } from '@nestjs/common';
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

@Module({
  controllers: [AppController, LoginController],
  providers: [
    AppService,
    JwtStrategy,
    JwtService,
    { provide: APP_GUARD, useClass: JwtGuard },
    RoleGuard,
    JwtGuard,
    LoginService,
  ],
  exports: [JwtStrategy],

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), // process.env.xxx must be called after this line
  ],
})
export class AppModule {}
