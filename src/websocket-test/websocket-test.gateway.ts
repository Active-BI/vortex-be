import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Isession, SocketSessionService, UserSession } from './serviceSocket';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface userToken {
  userId: string;
  name: string;
  email_active: string;
  email: string;
  status: boolean;
  role_id: string;
  role: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketTestGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;
  sendEvent(name, data: Isession) {
    this.eventEmitter.emit(name, {
      payload: data,
    });
  }
  constructor(
    private socketService: SocketSessionService,
    private eventEmitter: EventEmitter2,
  ) {
    setInterval(() => {
      this.deactivateSockets();
    }, 4000);
  }
  afterInit(server: any) {}
  handleConnection(client: any, ...args: any[]) {
    this.checkSocketConnections();
  }
  handleDisconnect(client: any) {
    this.checkSocketConnections();
  }

  async deactivateSockets() {
    this.socketService.deactivateSockets();
    this.server.emit('refresh-conn');
  }
  async checkSocketConnections() {
    this.socketService.SessionIsActive();
    this.server.emit('refresh-conn');
  }
  @SubscribeMessage('login')
  handleEvent(client: Socket, message) {
    const { sessionId, userName, tenant_id } = JSON.parse(message);
    const userSession = this.socketService.getUserSession(sessionId);
    if (userSession) {
      userSession.setSocket(client);
      this.socketService.sendEvent('create.session', {
        email: sessionId,
        tenant_id,
      });
      return;
    }
    this.socketService.addUserSession(client, sessionId, userName, tenant_id);
    this.server.emit('refresh-conn');
  }

  @SubscribeMessage('disconnect-session')
  async disconnectUser(client: Socket, emailToDisconnect: any): Promise<void> {
    console.log(emailToDisconnect)
    const user: boolean =
      this.socketService.removeUserSession(emailToDisconnect);
    if (user) {
      this.server.emit('refresh-conn');
    }
  }
  @SubscribeMessage('alive')
  async alive(client: Socket, message: any): Promise<void> {
    const { sessionId, userAgent, platform } = JSON.parse(message);
    const userByEmail = this.socketService.getUserSession(sessionId);
    if (!userByEmail) {
      client.emit('logout');
    }
    if (userByEmail) {
      userByEmail.setSocket(client);
      userByEmail.setStatus(true);
    }
  }
  @SubscribeMessage('user-check')
  async userCheck(client: Socket, message: any): Promise<void> {
    const sessionEmail = message;

    const userByEmail = this.socketService.getUserSession(sessionEmail);
    if (userByEmail) {
      userByEmail.setSocket(client);
      this.sendEvent('create.session', {
        tenant_id: userByEmail.tenant_id,
        email: userByEmail.sessionId,
      });
      this.checkSocketConnections();
    } else {
      client.emit('logout');
    }
  }
}
