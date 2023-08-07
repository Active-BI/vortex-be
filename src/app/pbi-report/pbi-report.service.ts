import { BadRequestException, Injectable } from '@nestjs/common';
import { TemplateHandlerService } from 'src/services/templateHandler.service';
import { PrismaService } from 'src/services/prisma.service';
import {
  generateBuffer,
  templates_xlsx,
  toCamelCase,
} from 'src/services/templates';
import * as Joi from 'joi';
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
    console.log({ tenant_id });
    try {
      const schema = Joi.array().items(
        Joi.object({
          nomeEmpresa: Joi.string().required(),
          matricula: Joi.any().required(),
          nome: Joi.string().required(),
          cargos: Joi.string().required(),
          dataAdmissao: Joi.string().required(),
          area: Joi.string().required(),
          salario: Joi.number().required(),
          sexo: Joi.string().required(),
          cutis: Joi.string().required(),
          dataNascimento: Joi.string().required(),
          email: Joi.string().required(),
          vinculoEmpregaticio: Joi.string().required(),
          situacaoEmpregado: Joi.string().required(),
          grauInstrucao: Joi.string().required(),
          pcd: Joi.boolean().required(),
          desligado: Joi.boolean().required(),
          dataDesligamento: Joi.any().required(),
          motivoDesligamento: Joi.any().required(),
        }),
      );
      try {
        await schema.validateAsync(dados);
      } catch (e) {
        throw new BadRequestException('Arquivo inválido ou campos ausentes.');
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
    } catch (e) {
      throw new BadRequestException('Arquivo inválido ou campos ausentes.');
    }
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
