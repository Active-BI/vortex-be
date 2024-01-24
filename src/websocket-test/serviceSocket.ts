import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

export class UserSession {
  sessionId: string;
  private name: string;
  private sockets: Map<string, Socket>;
  private status: boolean;
  tenant_id: string;

  constructor(sessionId: string, name: string, tenant_id: string, socket: Socket) {
    this.sessionId = sessionId;
    this.name = name;
    this.status = true;
    this.tenant_id = tenant_id;
    this.sockets = new Map<string, Socket>();

    this.setSocket(socket);
  }
  setSocket(socket: Socket): boolean {
    this.sockets.set(socket.id, socket);
    return true;
  }
  hasSocket(socketId: string): boolean {
    return this.sockets.has(socketId);
  }
  setStatus(status: boolean) {
    this.status = status;
  }
  getSocket(socketId: string): Socket {
    return this.sockets.get(socketId);
  }
  removeSocket(socketId: string) {
    this.sockets.delete(socketId);
  }
  removeAllSockets() {
    this.sockets.forEach((socket) => socket.emit('logout'));
    this.sockets.clear();
  }
  
  listUserSockets(Sockets = false): {
    name: string;
    tenant_id: string;
    status: boolean;
    sessionId: string;
    lastSocket: Socket | string;
    sockets: string[] | Map<string, Socket>;
  } {
    const sockets: string[] = [];
    this.sockets.forEach((client) => {
      sockets.push(client.id);
    });

    return {
      name: this.name,
      status: this.status,
      tenant_id: this.tenant_id,
      sessionId: this.sessionId,
      lastSocket: Sockets ? this.getSocket(sockets[-1]) : sockets[-1],
      sockets: Sockets ? this.sockets : sockets,
    };
  }
}

@Injectable()
export class SocketSessionService {
  constructor() {}
  userSessions = new Map<string, UserSession>();

  addUserSession(socket: Socket, sessionId: string, userName: string,tenant_id: string) {
    const userSession = this.getUserSession(sessionId);
    if (userSession) {
      userSession.setSocket(socket);
      this.userSessions.set(sessionId, userSession);
      return;
    }
    const newUserSession = new UserSession(sessionId, userName, tenant_id, socket);
    this.userSessions.set(sessionId, newUserSession);
  }

  getUserSession(sessionId: string): UserSession | false {
    if (this.userSessions.has(sessionId)) {
      return this.userSessions.get(sessionId);
    }
    return false;
  }

  getAllSocketSessionsByTenant(tenant_id, Socket = false): UserSession[] {
    let socketSessions: any[] = [];
    this.userSessions.forEach((session: UserSession) => {
      if (session.tenant_id === tenant_id) {
        const socketList = session.listUserSockets(Socket);
        socketSessions.push(socketList);
      }
    });

    return socketSessions;
  }

  SessionIsActive() {
    const arrayOfSessions = this.userSessions;
    for (const [id, userSession] of arrayOfSessions) {
      const connectedSockets = Array.from(userSession['sockets'].values()).some(
        (socket) => socket.connected,
      );
      if (!connectedSockets) {

      }
      userSession.setStatus(connectedSockets);
    }
  }

  removeUserSession(sessionId: string): boolean {
    const existUserSession = this.getUserSession(sessionId);
    if (existUserSession) {
      const userSession = existUserSession;

      userSession.removeAllSockets();

      this.userSessions.delete(sessionId);
      return true;
    }
    return false;
  }
}
