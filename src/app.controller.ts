import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BypassAuth } from './helpers/strategy/jwtGuard.service';
import { ApiResponse } from '@nestjs/swagger';
import { AppImageResponse } from './auth/login/Swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
