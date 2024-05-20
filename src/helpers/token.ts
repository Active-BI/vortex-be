export class RegisterToken {
  userId: string;
  contact_email: string;
}

export class Token {
  userId: string;
  name: string;
  tenant_id: string;
  tenant_name: string;
  contact_email: string;
  role_id: string;
  role_name: string;
  projects: string[];
  role_value: number;
  dashboardUser: any[];
  constructor(
    { id, name, contact_email, Rls, tenant_id, Tenant,projects },
    dashboardUser,
  ) {
    this.userId = id;
    this.name = name;
    this.contact_email = contact_email;
    this.role_id = Rls.id;
    this.role_name = Rls.name;
    this.tenant_id = tenant_id;
    this.projects = projects;
    this.tenant_name = Tenant.tenant_name;
    this.dashboardUser = dashboardUser;
  }
}
export class TempToken {
  email: string;
  constructor(email) {
    this.email = email;
  }
}
export class ResetPassTempToken {
  email: string;
  reset_pass: string;
  constructor(email, reset_pass) {
    this.email = email;
    this.reset_pass = reset_pass;
  }
}
