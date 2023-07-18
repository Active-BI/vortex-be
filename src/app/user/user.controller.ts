import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Req() req) {
    const { tenant_id } = req.tokenData;
    return await this.userService.findAll(tenant_id);
  }

  @Get(':id')
  async findById(@Req() req, @Param('id') id) {
    const { tenant_id } = req.tokenData;
    return await this.userService.findById(id, tenant_id);
  }

  @Put()
  async editUser(@Req() req, @Body() Body) {
    return await this.userService.UpdateUSer(Body);
  }

  @Post()
  async postUser(@Req() req, @Body() Body) {
    const { tenant_id } = req.tokenData;

    return await this.userService.createUser(Body, tenant_id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id) {
    await this.userService.deleteUser(id);
  }
}
