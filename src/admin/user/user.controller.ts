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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserBody, EditUserBody, UserResponse } from './dto/DTOS';
import { Roles } from 'src/helpers/roleDecorator/roles.decorator';
import { randomUUID } from 'crypto';

@ApiTags('User')
@ApiBearerAuth('JWT')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('Admin')
  @ApiCreatedResponse({
    description: 'Installment created successfully',
  })
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
  @ApiBody({ type: EditUserBody })
  async editUser(@Req() req, @Body() Body: EditUserBody) {
    return await this.userService.UpdateUSer(Body);
  }

  @Post()
  @Roles('Admin')
  @ApiBody({ type: CreateUserBody })
  @ApiResponse({ type: UserResponse })
  async postUser(@Req() req, @Body() body: CreateUserBody) {
    const { tenant_id } = req.tokenData;

    await this.userService.createUser(body, tenant_id);
  }
  @Post('resend')
  @Roles('Admin', 'Master')
  @ApiBody({ type: UserResponse })
  @ApiResponse({ type: CreateUserBody })
  async sendInvite(@Req() req, @Body() Body) {
    const { contact_email } = req.tokenData;
    await this.userService.createTransportEmail(
      Body.email,
      Body.user_id,
      contact_email,
    );
  }
  @Delete(':id')
  @Roles('Admin', 'Master')
  @ApiResponse({ type: 'void' })
  async deleteUser(@Param('id') id) {
    await this.userService.deleteUser(id);
  }
}
