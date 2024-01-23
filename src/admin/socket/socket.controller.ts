import { Controller, Get, Param } from '@nestjs/common';
import { SocketService } from './socket.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Get(':id')
  findAll(@Param('id') tenant_id) {
    return this.socketService.findAll(tenant_id);
  }
}
