import { Injectable } from '@nestjs/common';
import * as msal from '@azure/msal-node';
import { TemplateHandlerService } from 'src/services/templateHandler.service';
import { PrismaService } from 'prisma/prisma.service';
import { generateBuffer } from 'src/services/templates';

@Injectable()
export class PbiReportService {
  constructor(
    private templateHandler: TemplateHandlerService,
    private prisma: PrismaService,
  ) {}
  getTemplate(type) {
    return this.templateHandler.getTemplate(type);
  }

  async getFile(type: string, tenant_id) {
    console.log(type.toLowerCase() + '_table');
    const data = await this.prisma[type.toLowerCase() + '_table'].findMany({
      where: { tenant_id },
    });
    console.log(data);
    if (data.length < 1) {
      return this.templateHandler.getTemplate(type);
    }
    const sheetData = data.map((item) => Object.values(item));
    const headers = Object.keys(data[0]);

    return generateBuffer(headers, sheetData);
  }
}
