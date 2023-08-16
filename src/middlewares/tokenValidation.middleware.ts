import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from 'src/helpers/strategy/jwtStrategy.service';

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: JwtStrategy) {} // Injete o serviço responsável pela decodificação do token

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Obtenha o token da requisição (ajuste conforme sua implementação)
    if (token && token !== null && token !== 'null') {
      const decodedToken = this.tokenService.validate(token);

      if (!decodedToken) {
        res.status(401).json({ message: 'Token inválido' });
      }
      (req as any).tokenData = await decodedToken;
    } else {
      if (
        !req.baseUrl.includes('login') &&
        !req.baseUrl.includes('request-access')
      ) {
        return res.status(401).json({ message: 'Token inválido' });
      }
    }
    next();
  }
}
