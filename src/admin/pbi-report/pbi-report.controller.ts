import {
  Controller,
  Get,
  Param,
  Req,
  BadRequestException,
  Res,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PbiReportService } from './pbi-report.service';
import { JwtService } from '@nestjs/jwt';
import { EmbedConfig, PowerBiReportDetails } from './powerbi-dashboard.model';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { MsalService } from 'src/services/msal.service';
import { PrismaService } from 'src/services/prisma.service';

@Controller('pbi-report')
export class PbiReportController {
  async getPageType(type, tenant_id, userId) {
    const userPage = await this.prisma.user_Page.findFirst({
      where: {
        user_id: userId,
        Tenant_Page: {
          tenant_id,
          Page: {
            link: type,
          },
        },
      },
      include: { Tenant_Page: { include: { Page: true } } },
    });

    if (!userPage) throw new BadRequestException('Report não encontrado');
    return userPage;
  }
  constructor(
    private msalService: MsalService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Get('refresh-dataflow/:type')
  async refreshDataflow(@Param('type') type, @Req() req): Promise<any> {
    const { userId, tenant_id, role_name } = req.tokenData;
    const userPage = await this.getPageType(type, tenant_id, userId);
    const headers = await this.msalService.getRequestHeader(role_name);

    const getDataflows = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.Tenant_Page.Page.group_id}/dataflows`;
    let dataFlowId: any = {};
    await fetch(getDataflows, {
      method: 'GET',
      headers,
    }).then(async (res: any) => {
      if (!res.ok) {
        throw new BadRequestException('Falha ao obter dataflow');
      }
      const data = await res.json();
      dataFlowId = { id: data.value[0].objectId, ...data.value[0] };
    });

    const refreshDataflow = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.Tenant_Page.Page.group_id}/dataflows/${dataFlowId.id}/refreshes`;

    await fetch(refreshDataflow, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        notifyOption: true,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        throw new BadRequestException('Falha ao atualizar DataFlow');
      }
      return res;
    });
  }
  @Get('refresh/:type')
  async refreshReport(@Param('type') type, @Req() req): Promise<any> {
    const { userId, tenant_id, role_name } = req.tokenData;
    const userPage = await this.getPageType(type, tenant_id, userId);
    const headers = await this.msalService.getRequestHeader(role_name);

    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.Tenant_Page.Page.group_id}/reports/${userPage.Tenant_Page.Page.report_id}`;
    const result: any = await fetch(reportInGroupApi, {
      method: 'GET',
      headers,
    }).then((res) => {
      if (!res.ok) throw res;
      return res.json();
    });

    const refreshDataset = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.Tenant_Page.Page.group_id}/datasets/${result.datasetId}/refreshes`;

    await fetch(refreshDataset, {
      method: 'POST',
      headers,
    }).then((res: any) => {
      if (!res.ok) {
        if (res.status === 429)
          throw new HttpException(
            'Limite de atualizações atingido',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        throw new BadRequestException('Falha ao atualizar relatório');
      }
      return res;
    });
  }

  @Get('type/:type')
  async ReportByTYpe(@Param('type') type, @Req() req): Promise<any> {
    const { userId, tenant_id, role_name } = req.tokenData;
    const userPage = await this.getPageType(type, tenant_id, userId);
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.Tenant_Page.Page.group_id}/reports/${userPage.Tenant_Page.Page.report_id}`;

    // header é o objeto onde está o accessToken
    const headers = await this.msalService.getRequestHeader(role_name);

    const result: any = await fetch(reportInGroupApi, {
      method: 'GET',
      headers,
    }).then((res) => {
      if (!res.ok) throw res;
      return res.json();
    });
    const reportDetails = new PowerBiReportDetails(
      result.id,
      result.name,
      result.embedUrl,
    );
    const reportEmbedConfig = new EmbedConfig();

    reportEmbedConfig.reportsDetail = [reportDetails];
    const datasetIds = [result.datasetId];
    const user = this.jwtService.decode(
      req.headers.authorization.split(' ')[1],
    );

    reportEmbedConfig.embedToken =
      await this.getEmbedTokenForSingleReportSingleWorkspace(
        userPage.Tenant_Page.Page.report_id,
        datasetIds,
        userPage.Tenant_Page.Page.group_id,
        user,
        headers,
      );
    return reportEmbedConfig;
  }

  @BypassAuth()
  async getEmbedTokenForSingleReportSingleWorkspace(
    reportId,
    datasetIds,
    targetWorkspaceId,
    user,
    header,
  ) {
    const formData = {
      accessLevel: 'View',
    };
    const listReportRls = ['8dd5b75b-03f5-41ab-8d6c-6a69c8934d88'];
    const shoudPassRls = listReportRls.find((report) => report === reportId);

    if (shoudPassRls) {
      formData['identities'] = [
        {
          username: user.contact_email,
          roles: [user.role_name],
          reports: [reportId],
          datasets: [datasetIds[0]],
        },
      ];
    }
    // Add dataset ids in the request

    formData['datasets'] = [];
    for (const datasetId of datasetIds) {
      formData['datasets'].push({
        id: datasetId,
      });
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
      formData['targetWorkspaces'] = [];

      formData['targetWorkspaces'].push({
        id: targetWorkspaceId,
      });
    }

    // Generate Embed token for single report, workspace, and multiple datasets. Refer https://aka.ms/MultiResourceEmbedToken
    const embedTokenApi = `https://api.powerbi.com/v1.0/myorg/groups/${targetWorkspaceId}/reports/${reportId}/GenerateToken`;
    return await fetch(embedTokenApi, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        ...formData,
      }),
    }).then((res) => {
      if (!res.ok) throw res;
      return res.json();
    });
  }
}
