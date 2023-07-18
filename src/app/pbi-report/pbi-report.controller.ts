import {
  Controller,
  Get,
  Param,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { PbiReportService } from './pbi-report.service';
import { JwtService } from '@nestjs/jwt';
import { EmbedConfig, PowerBiReportDetails } from './powerbi-dashboard.model';
import { BypassAuth } from 'src/helpers/strategy/jwtGuard.service';
import { MsalService } from 'src/services/msal.service';
import { Token } from 'src/helpers/token';
import { PrismaService } from 'prisma/prisma.service';
import { Client } from '@microsoft/microsoft-graph-client';
// import { tabelas } from 'prisma/tabelas';

@Controller('pbi-report')
export class PbiReportController {
  private client: Client;

  constructor(
    private readonly pbiReportService: PbiReportService,
    private msalService: MsalService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  @Get('type/:type')
  async ReportByTYpe(@Param('type') type, @Req() req): Promise<any> {
    const { userId, tenant_id, role_name } = req.tokenData;
    const userDashboard = await this.prisma.user_Tenant_DashBoard.findFirst({
      where: {
        user_id: userId,
        Tenant_DashBoard: {
          tenant_id,
          Dashboard: {
            type,
          },
        },
      },
      include: { Tenant_DashBoard: { include: { Dashboard: true } } },
    });
    console.log(userDashboard);
    if (!userDashboard) throw new BadRequestException('Report não encontrado');
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${userDashboard.Tenant_DashBoard.Dashboard.group_id}/reports/${userDashboard.Tenant_DashBoard.Dashboard.report_id}`;

    // header é o objeto onde está o accessToken
    const headers = await this.msalService.getRequestHeader(
      tenant_id,
      role_name,
    );
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
        userDashboard.Tenant_DashBoard.Dashboard.report_id,
        datasetIds,
        userDashboard.Tenant_DashBoard.Dashboard.group_id,
        user,
        headers,
      );
    return reportEmbedConfig;
  }
  @Get(':reportId/:workspaceId')
  async Report(
    @Param('workspaceId') workspaceId,
    @Param('reportId') reportId,
    @Req() req,
  ): Promise<any> {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const { userId, tenant_id, role_name } = req.tokenData;

    // header é o objeto onde está o accessToken
    const headers = await this.msalService.getRequestHeader(
      tenant_id,
      role_name,
    );
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
        reportId,
        datasetIds,
        workspaceId,
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
    const listReportRls = ['4a6f3b19-88c4-4547-802e-8964810cfa66'];
    const shoudPassRls = listReportRls.find((report) => report === reportId);

    if (shoudPassRls) {
      formData['identities'] = [
        {
          username: user.email,
          roles: [user.role],
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
