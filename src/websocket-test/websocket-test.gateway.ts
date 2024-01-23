import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketSessionService } from './serviceSocket';
import { Server, Socket } from 'socket.io';

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

  constructor(
    private socketService: SocketSessionService,
  ) {}
  afterInit(server: any) {}
  handleConnection(client: any, ...args: any[]) {
    this.checkSocketConnections();
  }
  handleDisconnect(client: any) {
    this.checkSocketConnections();
  }
  async checkSocketConnections() {
    this.socketService.SessionIsActive();
    this.server.emit('refresh-conn');
  }
  @SubscribeMessage('login')
  handleEvent(client: Socket, message) {
    const { sessionId, userName, tenant_id } = JSON.parse(message);
    const userByEmail = this.socketService.getUserSession(sessionId);
    if (userByEmail) {
      userByEmail.setSocket(client);
      return;
    }
    this.socketService.addUserSession(client, sessionId, userName, tenant_id);
    this.server.emit('refresh-conn');
  }

  @SubscribeMessage('disconnect-session')
  async disconnectUser(client: Socket, emailToDisconnect: any): Promise<void> {
    const user: boolean =
      this.socketService.removeUserSession(emailToDisconnect);
    if (user) {
      this.server.emit('refresh-conn');
    }
  }
  @SubscribeMessage('user-check-session')
  async userCheckSession(client: Socket, message: any): Promise<void> {
    const { sessionId: sessionEmail } = message;
    const userByEmail = this.socketService.getUserSession(sessionEmail);
    if (!userByEmail) {
      client.emit('logout');
    } else {
    }
  }
  @SubscribeMessage('user-check')
  async userCheck(client: Socket, message: any): Promise<void> {
    const sessionEmail= message;

    const userByEmail = this.socketService.getUserSession(sessionEmail);
    if (userByEmail) {
      userByEmail.setSocket(client);
      this.checkSocketConnections();
    } else {
      client.emit('logout');
    }
  }
}
