import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export default class SessionRepository {
  constructor(private prisma: PrismaService) {}
  async findLastAccess(email, tenant_id) {
    return await this.prisma.user_Session_Hist.findFirst({
      where: {
        email: {
          equals: email,
        },
        AND: {
          tenant_id: {
            equals: tenant_id,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
  @OnEvent('create.session')
  async handleCreateSession({ payload }) {
    const lastSession = await this.findLastAccess(
      payload.email,
      payload.tenant_id,
    );
    if (lastSession && lastSession.exited_at === null) {
      console.log('Atualizando sessão')
      await this.prisma.user_Session_Hist.update({
        where: {
          id: lastSession.id,
        },
        data: {
          tenant_id: payload.tenant_id,
          email: payload.email,
          updated_at: new Date().toISOString(),
        },
      });
      return;
    } else if (
      lastSession &&
      lastSession.exited_at !== null &&
      moment(moment().utc()).diff(lastSession.exited_at, 'minutes') < 60
    ) {
      console.log('Atualizando sessão')

      await this.prisma.user_Session_Hist.update({
        where: {
          id: lastSession.id,
        },
        data: {
          tenant_id: payload.tenant_id,
          email: payload.email,
          updated_at: new Date().toISOString(),
          exited_at: null,
        },
      });
    } else {
      console.log('Criando sessão')
      
      await this.prisma.user_Session_Hist.create({
        data: {
          tenant_id: payload.tenant_id,
          email: payload.email,
        },
      });
      return;
    }
  }

  @OnEvent('close.session')
  async handleCloseSession({
    payload,
  }: {
    payload: { email: string; tenant_id: string };
  }) {
        console.log(payload);
    const lastSession = await this.findLastAccess(
      payload.email,
      payload.tenant_id,
    );
    if (lastSession && !lastSession.exited_at) {
      await this.prisma.user_Session_Hist.update({
        where: {
          id: lastSession.id,
        },
        data: {
          exited_at: new Date().toISOString(),
        },
      });
      console.log(lastSession.id, 'MESSAGEM DO EVENTO DE ENCERRAMENTO');
    }
  }
}
