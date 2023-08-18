import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RegisterToken, ResetPassTempToken, TempToken, Token } from '../token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'],
    });
  }

  async signRegisterToken(paylaod: RegisterToken) {
    return this.jwtService.sign(
      { ...paylaod },
      {
        secret: process.env['JWT_SECRET'],
        expiresIn: '24h',
      },
    );
  }
  async signConfirmRequest(paylaod: any) {
    return this.jwtService.sign(
      { ...paylaod },
      {
        secret: process.env['JWT_SECRET'],
        expiresIn: '24h',
      },
    );
  }
  async signToken(paylaod: Token) {
    return this.jwtService.sign(
      { ...paylaod },
      {
        secret: process.env['JWT_SECRET'],
        expiresIn: '24h',
      },
    );
  }
  async signTempToken(paylaod: TempToken | ResetPassTempToken) {
    return this.jwtService.sign(
      { ...paylaod },
      {
        secret: process.env['JWT_TEMP_SECRET'],
        expiresIn: '5m',
      },
    );
  }

  async validate(payload) {
    try {
      return await this.jwtService.verifyAsync(payload, {
        secret: process.env['JWT_SECRET'],
      });
    } catch (e) {
      throw new ForbiddenException('Token inválido');
    }
  }
}
