import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Req() req) {
    const { tenant_id } = req.tokenData;
    return await this.userService.findAll(tenant_id);
  }
}
