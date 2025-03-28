import {
  Controller,
  Get,
  Param,
  Req,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PbiReportService } from './pbi-report.service';
import { JwtService } from '@nestjs/jwt';
import { EmbedConfig, PowerBiReportDetails } from './powerbi-dashboard.model';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { MsalService } from 'src/services/msal.service';
import { PrismaService } from 'src/services/prisma.service';
import { Page } from '@prisma/client';

@Controller('pbi-report')
export class PbiReportController {
  constructor(
    private msalService: MsalService,
    private pbiReportService: PbiReportService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Get('dashboard/:group/:type')
  async DashByTYpe(
    @Param('type') type,
    @Param('group') group,
    @Req() req,
  ): Promise<any> {
    const { userId, tenant_id, role_name } = req.tokenData;
    const userPage = await this.pbiReportService.getPageType(
      group,
      type,
      tenant_id,
      userId,
    );
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.group_id}/dashboards/${userPage.report_id}`;

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
      await this.getEmbedTokenForSingleDashboardSingleWorkspace(
        userPage.report_id,
        datasetIds,
        userPage.group_id,
        user,
        headers,
      );
    return reportEmbedConfig;
  }
  @Get('refresh-dataflow/:group/:type')
  async refreshDataflow(
    @Param('type') type,
    @Param('group') group,
    @Req() req,
  ): Promise<any> {
    const { userId, tenant_id, role_name } = req.tokenData;
    const page = await this.pbiReportService.getPageType(
      group,
      type,
      tenant_id,
      userId,
    );
    const headers = await this.msalService.getRequestHeader(role_name);

    const getDataflows = `https://api.powerbi.com/v1.0/myorg/groups/${page.group_id}/dataflows`;
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

    const refreshDataflow = `https://api.powerbi.com/v1.0/myorg/groups/${page.group_id}/dataflows/${dataFlowId.id}/refreshes`;

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
  @Get('refresh/:group/:type')
  async refreshDataset(
    @Param('type') type,
    @Param('group') group,
    @Req() req,
  ): Promise<any> {
    const { userId, tenant_id, role_name, tenant_name } = req.tokenData;
    let userPage;
    if (role_name === 'Master') {
      userPage = await this.pbiReportService.getPageTypeMaster(group, type);
    } else {
      userPage = await this.pbiReportService.getPageType(
        group,
        type,
        tenant_id,
        userId,
      );
    }

    const headers = await this.msalService.getRequestHeader(role_name);

    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.group_id}/reports/${userPage.report_id}`;
    const result: any = await fetch(reportInGroupApi, {
      method: 'GET',
      headers,
    }).then((res) => {
      if (!res.ok) throw res;
      return res.json();
    });

    const refreshDataset = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.group_id}/datasets/${result.datasetId}/refreshes`;
    try {
      await fetch(refreshDataset, {
        method: 'POST',
        headers,
      }).then((res: any) => {
        if (!res.ok) {
          if (res.status === 429) {
            throw new HttpException(
              'Limite de atualizações atingido',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }
          throw new BadRequestException('Falha ao atualizar relatório');
        }
        return res;
      });
    } catch (error) {}
  }

  @Get(':group/:type')
  async ReportByTYpe(
    @Param('type') type,
    @Param('group') group,
    @Req() req,
  ): Promise<any> {
    const { userId, tenant_id, role_name } = req.tokenData;
    const page = await this.pbiReportService.getPageType(
      group,
      type,
      tenant_id,
      userId,
    );

    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${page.group_id}/reports/${page.report_id}`;

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
        page,
        datasetIds,
        page.group_id,
        user,
        headers,
      );
    return reportEmbedConfig;
  }

  @BypassAuth()
  async getEmbedTokenForSingleReportSingleWorkspace(
    report: Page,
    datasetIds,
    targetWorkspaceId,
    user,
    header,
  ) {
    const formData = {
      accessLevel: 'View',
    };
    console.log('report', report);

    // const listReportRls = ['0cafa534-6e24-45e3-8ffe-ae39d98c7695'];
    // const shoudPassRls = listReportRls.find((rep) => rep === report.report_id);

    if (report.has_RLS) {
      formData['identities'] = [
        {
          username: user.contact_email,
          roles: [user.role_name],
          reports: [report.report_id],
          datasets: [datasetIds[0]],
        },
      ];
    }
    // Add dataset ids in the request222

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
    const embedTokenApi = `https://api.powerbi.com/v1.0/myorg/groups/${targetWorkspaceId}/reports/${report.report_id}/GenerateToken`;
    return await fetch(embedTokenApi, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        ...formData,
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .catch((err) => console.log(err));
  }
  @BypassAuth()
  async getEmbedTokenForSingleDashboardSingleWorkspace(
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
    const embedTokenApi = `https://api.powerbi.com/v1.0/myorg/groups/${targetWorkspaceId}/dashboards/${reportId}/GenerateToken`;
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
  @Get(':group/:type/exportTo')
  async exportTo(
    @Param('type') type,
    @Param('group') group,
    @Req() req,
  ): Promise<any> {
    const { userId, tenant_id, role_name } = req.tokenData;
    const userPage = await this.pbiReportService.getPageType(
      group,
      type,
      tenant_id,
      userId,
    );
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${userPage.group_id}/reports/${userPage.report_id}/ExportTo`;
    // header é o objeto onde está o accessToken
    const headers = await this.msalService.getRequestHeader(role_name);
    const result: any = await fetch(reportInGroupApi, {
      method: 'POST',
      body: {
        format: 'PDF',
      },
      headers,
    } as any).then((res) => {
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
        userPage,
        datasetIds,
        userPage.group_id,
        user,
        headers,
      );
    return reportEmbedConfig;
  }
}
