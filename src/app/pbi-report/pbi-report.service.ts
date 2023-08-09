import { BadRequestException, Injectable } from '@nestjs/common';
import { TemplateHandlerService } from 'src/services/templateHandler.service';
import { PrismaService } from 'src/services/prisma.service';
import {
  generateBuffer,
  templates_xlsx,
  toCamelCase,
} from 'src/services/templates';
import * as Joi from 'joi';
import moment from 'moment';
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
    const schema = Joi.array().items(
      Joi.object({
        nomeEmpresa: Joi.any().required(),
        matricula: Joi.any().required(),
        nome: Joi.string().required(),
        cargos: Joi.string().required(),
        dataAdmissao: Joi.date().required(),
        area: Joi.string().required(),
        salario: Joi.number().required(),
        sexo: Joi.string().valid('Masculino', 'Feminino', 'Outros').required(),
        cutis: Joi.string().valid('Pardo', 'Branco', 'Negro').required(),
        dataNascimento: Joi.date().required(),
        email: Joi.string().required(),
        vinculoEmpregaticio: Joi.string()
          .valid('CLT', 'PJ', 'FREELANCER', 'Prazo Determinado (Lei 9.601)')
          .required(),
        situacaoEmpregado: Joi.string().required().valid('Ativo', 'Demitido'),
        grauInstrucao: Joi.string().required(),
        pcd: Joi.boolean().required(),
        desligado: Joi.boolean().required(),
        dataDesligamento: Joi.date().allow(null),
        motivoDesligamento: Joi.string().allow(null).required(),
      }),
    );
    try {
      await schema.validateAsync(dados);
    } catch ({ details }) {
      throw new BadRequestException({
        message: 'Arquivo inválido ou campos ausentes.',
        log: details[0],
      });
    }
    try {
      const dadosFormatados = dados.map((dado) => {
        if (dado['id']) delete dado.id;
        return {
          ...dado,
          matricula: String(dado.matricula),
          tenant_id: tenant_id,
        };
      });
      await this.prisma[type.toLowerCase() + '_table'].deleteMany({
        where: { tenant_id },
      });
      await this.prisma[type.toLowerCase() + '_table'].createMany({
        data: dadosFormatados,
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Erro ao inserir dados.');
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
