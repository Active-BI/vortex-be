export class EmbedConfig {
  type;
  reportsDetail;
  embedToken;
  identities;
  constructor(type?, reportsDetail?, embedToken?) {
    this.type = type;
    this.reportsDetail = reportsDetail;
    this.embedToken = embedToken;
    this.identities = embedToken;
  }
}
export class PowerBiReportDetails {
  reportId = '';
  reportName = [];
  embedUrl = '';
  constructor(reportId, reportName, embedUrl) {
    this.reportId = reportId;
    this.reportName = reportName;
    this.embedUrl = embedUrl;
  }
}
export class PowerBiDashboardDetails {
  reportId = '';
  reportName = [];
  embedUrl = '';
  constructor(reportId, reportName, embedUrl) {
    this.reportId = reportId;
    this.reportName = reportName;
    this.embedUrl = embedUrl;
  }
}
