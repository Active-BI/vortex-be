import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { PageService } from './page.service';
import { ApiTags } from '@nestjs/swagger';
import { SocketService } from '../socket/socket.service';

@ApiTags('Page')
@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService, private socketService: SocketService) {}
  @Get()
  async getAllPages(@Req() req) {
    const { tenant_id } = req.tokenData;
    return await this.pageService.getAllPages(tenant_id);
  }
  @Get('/:userid')
  async getAllPagesByUser(@Req() req, @Param('userid') userid) {
    const { tenant_id } = req.tokenData;
    return await this.pageService.getAllPagesByUser(userid, tenant_id);
  }
  @Post('/:userid')
  async setPageToUser(@Req() req, @Body() body, @Param('userid') userid) {
    const { PageUserList } = body;
    const { tenant_id } = req.tokenData;
    await this.pageService.setPageUser(PageUserList, userid, tenant_id);
  }

  @Get('/user/user-by-page')
  async getAllUsersByPage(@Req() req, @Res() res) {
    const { tenant_id } = req.tokenData;
    const conections = await this.socketService.findAll(tenant_id);

    const data = await this.pageService.getAllUsersByPage(tenant_id);
    const result = data.reduce((acc, page) => {
      const titulo = page.Page.title;
      page.User_Page.forEach((user) => {
        acc.push({titulo, name: user.User.name, contact_email: user.User.contact_email});
      });
      return acc;
    }, []);
    res.send(result);
  }

  @Get('/user/user-by-page-export')
  async getAllUsersByPageExport(@Req() req, @Res() res) {
    const { tenant_id } = req.tokenData;
    const conections = await this.socketService.findAll(tenant_id);

    const data = await this.pageService.getAllUsersByPage(tenant_id);
    const result = data.reduce((acc, page) => {
      const titulo = page.Page.title;
      page.User_Page.forEach((user) => {
        acc.push([titulo, user.User.name,user.User.contact_email]);
      });
      return acc;
    }, []);
    const acessos = conections.map(u => ([u.name, u.log.length,u.contact_email, u.log[u.log.length - 1]?.created_at]))
    const buffer = await this.pageService.exportToExcel([
      { sheet: 'permissões', header: ['Relatório', 'Nome', "Email",  ], data: result },
      { sheet: 'acessos', header: ['Nome', "Email", 'Total de Acessos', 'Data último acesso'], data: acessos },
    ]);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    res.send(buffer);
  }

  @Delete('user-by-page/:userid/:pageid')
  async getUsersByPage(
    @Req() req,
    @Param('userid') userid,
    @Param('pageid') pageid,
  ) {
    const { tenant_id } = req.tokenData;
    return await this.pageService.deleteUsersByPage(tenant_id, userid, pageid);
  }
}
