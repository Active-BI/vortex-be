import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { PageService } from './page.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Page')
@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}
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
  async getAllUsersByPage(@Req() req) {
    const { tenant_id } = req.tokenData;
    console.log({tenant_id})
    return await this.pageService.getAllUsersByPage(tenant_id);
  }

  @Delete('user-by-page/:userid/:pageid')
  async getUsersByPage(@Req() req, @Param('userid') userid, @Param('pageid') pageid) {
    const { tenant_id } = req.tokenData;
    return await this.pageService.deleteUsersByPage(tenant_id,userid,pageid);
  }
}
