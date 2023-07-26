import { BadRequestException, Injectable } from '@nestjs/common';
import { TemplateHandlerService } from 'src/services/templateHandler.service';
import { PrismaService } from 'prisma/prisma.service';
import {
  generateBuffer,
  templates_xlsx,
  toCamelCase,
} from 'src/services/templates';

@Injectable()
export class PbiReportService {
  constructor(
    private templateHandler: TemplateHandlerService,
    private prisma: PrismaService,
  ) {}
  getTemplate(type) {
    return this.templateHandler.getTemplate(type);
  }

  objetoPossuiTodasChaves(objeto, type) {
    return Object.values(templates_xlsx[type]).every((chave) => {
      return objeto.hasOwnProperty(chave);
    });
  }
  async postFile(dados, tenant_id, type) {
    const todosObjetosPossuemTodasChaves = dados.every((d) => {
      return Object.values(templates_xlsx[type]).every((e: string) => {
        return Object.keys(d).includes(e);
      });
    });
    if (!todosObjetosPossuemTodasChaves) {
      throw new BadRequestException('Arquivo inválido, campos ausentes.');
    }
    const dadosFormatados = dados.map((dado) => {
      if (dado['id']) delete dado.id;
      return { ...dado, tenant_id: tenant_id };
    });
    await this.prisma[type.toLowerCase() + '_table'].deleteMany({
      where: { tenant_id },
    });
    await this.prisma[type.toLowerCase() + '_table'].createMany({
      data: dadosFormatados,
    });
  }
  async getFile(type: string, tenant_id) {
    const data = await this.prisma[type.toLowerCase() + '_table'].findMany({
      where: { tenant_id },
    });

    if (data.length < 1) {
      return this.templateHandler.getTemplate(type);
    }
    const sheetData = data.map((item) => Object.values(item));
    const headers = Object.keys(data[0]);

    return generateBuffer(headers, sheetData);
  }
}
