import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { RHTemplate, templates_xlsx } from './templates';

@Injectable()
export class TemplateHandlerService {
  constructor(private prisma: PrismaService) {}

  getTemplate(type) {
    if (!Object.keys(templates_xlsx).includes(type.toUpperCase()))
      throw new UnauthorizedException('Template não existe');
    return RHTemplate(type);
  }
}
