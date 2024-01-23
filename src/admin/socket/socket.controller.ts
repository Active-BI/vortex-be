import { Controller, Get, Param } from '@nestjs/common';
import { SocketService } from './socket.service';

@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Get(':id')
  findAll(@Param('id') tenant_id) {
    return this.socketService.findAll(tenant_id);
  }
}
