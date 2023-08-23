import { BadRequestException, Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { PrismaService } from 'src/services/prisma.service';
import { TemplateHandlerService } from 'src/services/templateHandler.service';
import { generateBuffer, templates_xlsx } from 'src/services/templates';

@Injectable()
export class FilesService {
  constructor(
    private templateHandler: TemplateHandlerService,
    private prisma: PrismaService,
  ) {}
  getTemplate(type) {
    return this.templateHandler.getTemplate(type);
  }
  async getDashboardType(type, tenant_id, userId) {
    const userDashboard = await this.prisma.user_Page.findFirst({
      where: {
        user_id: userId,
        Tenant_Page: {
          tenant_id,
          Page: {
            link: type,
          },
        },
      },
      include: { Tenant_Page: { include: { Page: true } } },
    });

    if (!userDashboard) throw new BadRequestException('Report não encontrado');
    return userDashboard;
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
        nome: Joi.any().required(),
        cargos: Joi.any().required(),
        dataAdmissao: Joi.date().required(),
        area: Joi.any().required(),
        salario: Joi.number().required(),
        sexo: Joi.string().required(),
        cutis: Joi.string().required(),
        dataNascimento: Joi.date().required(),
        email: Joi.string().required(),
        vinculoEmpregaticio: Joi.string().required(),
        situacaoEmpregado: Joi.string().required(),
        grauInstrucao: Joi.string().required(),
        pcd: Joi.boolean().required(),
        desligado: Joi.boolean().required(),
        dataDesligamento: Joi.date().allow(null),
        motivoDesligamento: Joi.string().allow(null),
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
          nomeEmpresa: String(dado.nomeEmpresa),
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
