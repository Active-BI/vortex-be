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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserBody, CreateUserResponse, UserResponse } from './Swagger';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('Admin')
  @ApiResponse({ type: [UserResponse] })
  async findAll(@Req() req) {
    const { tenant_id } = req.tokenData;
    return await this.userService.findAll(tenant_id);
  }

  @Get(':id')
  @Roles('Admin')
  @ApiResponse({ type: UserResponse })
  async findById(@Req() req, @Param('id') id) {
    const { tenant_id } = req.tokenData;
    return await this.userService.findById(id, tenant_id);
  }

  @Put()
  @Roles('Admin')
  @ApiResponse({ type: UserResponse })
  @ApiBody({ type: CreateUserBody })
  async editUser(@Req() req, @Body() Body) {
    return await this.userService.UpdateUSer(Body);
  }

  @Post()
  @Roles('Admin')
  @ApiBody({ type: UserResponse })
  @ApiResponse({ type: CreateUserBody })
  async postUser(@Req() req, @Body() Body) {
    const { tenant_id } = req.tokenData;

    return await this.userService.createUser(Body, tenant_id);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiResponse({ type: 'void' })
  async deleteUser(@Param('id') id) {
    await this.userService.deleteUser(id);
  }
}
