import { BadRequestException, Injectable } from '@nestjs/common';
import { TemplateHandlerService } from 'src/services/templateHandler.service';
import { PrismaService } from 'src/services/prisma.service';
import { generateBuffer, templates_xlsx } from 'src/services/templates';
import * as Joi from 'joi';
@Injectable()
export class PbiReportService {
  constructor(
    private templateHandler: TemplateHandlerService,
    private prisma: PrismaService,
  ) {}
}
