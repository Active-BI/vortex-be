import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SocketSessionService } from 'src/websocket-test/serviceSocket';

@Injectable()
export class SocketService {
  constructor(private SocketService: SocketSessionService, private prisma: PrismaService) {}
  disconnect(userEmail: string) {
    return this.SocketService.removeUserSession(userEmail);
  }
  async findAllActiveSessions(tenant_id) {
    const sessionHist = await this.prisma.user_Session_Hist.findMany({
      where:{
        tenant_id
      }
    })
    const sessionRealTime = await this.SocketService.getAllSocketSessionsByTenant(tenant_id)
    const a = sessionRealTime.reduce((acc, act) => {
      act['log'] = sessionHist.filter(a => a.email === act.sessionId)
       acc.push(act)
       return acc
    },[])
    return a.sort((a,b) => {
      if (a.log < b.log) {
        return 1
      }
      return -1
    });
  }
  async findAll(tenant_id) {
    const user = await this.prisma.user.findMany({
      where: {
        tenant_id
      }
    })
    const sessionHist = await this.prisma.user_Session_Hist.findMany({
      where:{
        tenant_id
      }
    })
    const sessionRealTime = await this.SocketService.getAllSocketSessionsByTenant(tenant_id)
    const a = user.reduce((acc, act) => {
      act['log'] = sessionHist.filter(a => a.email === act.contact_email)

      if (sessionRealTime.length > 0){
        act['status'] = sessionRealTime.find(u =>act.contact_email  === u.sessionId)
      }
       acc.push(act)
       return acc
    },[])
    return a.sort((a,b) => {
      if (a.log < b.log) {
        return 1
      }
      return -1
    });
  }
}
