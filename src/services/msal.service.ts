import { Injectable } from '@nestjs/common';
import * as msal from '@azure/msal-node';
import { config } from 'src/helpers/config';
import { User } from '@prisma/client';

@Injectable()
export class MsalService {
  async getAccessToken(userRls: string) {
    const msalConfig = {
      auth: {
        clientId: config.clientId,
        authority: `${config.authorityUrl}`,
        clientSecret: '',
      },
    };

    if (config.authenticationMode.toLowerCase() === 'masteruser') {
      const clientApplication = new msal.PublicClientApplication(msalConfig);

      const usernamePasswordRequest = {
        scopes: [config.scopeBase],
        username: config.pbiUsername,
        password: config.pbiPassword,
        roles: [userRls],
      };

      return clientApplication.acquireTokenByUsernamePassword(
        usernamePasswordRequest,
      );
    }
  }
  async getRequestHeader(userRls: string) {
    const tokenResponse = await this.getAccessToken(userRls);

    const token = tokenResponse.accessToken;
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(token),
    };
  }
}
