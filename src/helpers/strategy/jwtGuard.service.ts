import { Injectable, SetMetadata } from '@nestjs/common';
import { ExecutionContext, NestMiddleware } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

export const BYPASS_KEY = 'bypass';
export const BypassAuth = () => {
  return SetMetadata(BYPASS_KEY, true);
};
export const shouldBypassAuth = (
  context: ExecutionContext,
  reflector: Reflector,
): boolean => {
  return reflector.get(BYPASS_KEY, context.getHandler());
};

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }
  private extractJwtFromRequest(request: any): string | null {
    if (request.headers.authorization?.startsWith('Bearer ')) {
      return request.headers.authorization.split(' ')[1];
    }
    if (request.cookies?.token) {
      return request.cookies.token;
    }
    return null;
  }
  async canActivate(context: ExecutionContext) {
    if (shouldBypassAuth(context, this.reflector)) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromRequest(request);

    if (!token) {
      return false;
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env['JWT_SECRET'],
      });
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    return user;
  }
}
