import { BadRequestException, Injectable } from '@nestjs/common';
import { TemplateHandlerService } from 'src/services/templateHandler.service';
import { PrismaService } from 'src/services/prisma.service';
import { MsalService } from 'src/services/msal.service';

@Injectable()
export class PbiReportService {
  constructor(
    private templateHandler: TemplateHandlerService,
    private prisma: PrismaService,
    private msalService: MsalService,
  ) {}

  async getDatasetsInf(reportName, groupName, tokenData): Promise<any> {
    const { userId, tenant_id, tenant_name, role_name } = tokenData;
    let userPage;
    try {
      if (tenant_name === 'Master') {
        userPage = await this.getPageTypeMaster(groupName, reportName);
      } else {
        userPage = await this.getPageType(
          groupName,
          reportName,
          tenant_id,
          userId,
        );
      }

      if (userPage.Tenant_Page.Page.page_type !== 'report') {
        return {};
      }

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

      const datasetId = result.datasetId;
      const getDatasets = `https://api.powerbi.com/v1.0/myorg/datasets/${datasetId}/refreshes?$top=1`;

      const dataset: any = await fetch(getDatasets, {
        method: 'GET',
        headers,
      }).then((res) => {
        if (!res.ok) throw res;

        return res.json();
      });
      const lastRefresh = dataset.value[0];
      delete lastRefresh.refreshAttempts;
      return lastRefresh;
    } catch (error) {
      console.log('Erro ao buscar informações do dataset', error);
      return {};
    }
  }

  async getPageType(group, type, tenant_id, userId) {
    const userPage = await this.prisma.user_Page.findFirst({
      where: {
        user_id: userId,
        Tenant_Page: {
          tenant_id,
          Page: {
            AND: {
              Page_Group: {
                formated_title: group,
              },
              formated_title: type,
            },
          },
        },
      },
      include: { Tenant_Page: { include: { Page: true } } },
    });

    if (!userPage) throw new BadRequestException('Report não encontrado');
    return userPage;
  }
  async getPageTypeMaster(group, type) {
    const userPage = await this.prisma.user_Page.findFirst({
      where: {
        Tenant_Page: {
          Page: {
            AND: {
              Page_Group: {
                formated_title: group,
              },
              formated_title: type,
            },
          },
        },
      },
      include: { Tenant_Page: { include: { Page: true } } },
    });

    if (!userPage) throw new BadRequestException('Report não encontrado');
    return userPage;
  }
}
