import { Injectable } from '@nestjs/common';
import { SocketSessionService } from 'src/websocket-test/serviceSocket';

@Injectable()
export class SocketService {
  constructor(private SocketService: SocketSessionService) {}
  disconnect(userEmail: string) {
    return this.SocketService.removeUserSession(userEmail);
  }

  findAll(tenant_id) {
    const result = this.SocketService.getAllSocketSessionsByTenant(tenant_id);
    return result;
  }
}
