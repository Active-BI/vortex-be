import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ResetPassTempToken, TempToken, Token } from '../token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'],
    });
  }

  async signToken(paylaod: Token) {
    return this.jwtService.sign(
      { ...paylaod },
      {
        secret: process.env['JWT_SECRET'],
        expiresIn: 3000,
      },
    );
  }
  async signTempToken(paylaod: TempToken | ResetPassTempToken) {
    return this.jwtService.sign(
      { ...paylaod },
      {
        secret: process.env['JWT_TEMP_SECRET'],
        expiresIn: 3000,
      },
    );
  }
  async validate(payload) {
    return {
      ...payload,
    };
  }
}
