export class RegisterToken {
  userId: string;
  contact_email: string;
}

export class Token {
  userId: string;
  name: string;
  tenant_id: string;
  personal_email: string;
  contact_email: string;
  role_id: string;
  role_name: string;
  role_value: number;
  dashboardUser: any[];
  constructor(
    { id, name, contact_email, personal_email, Rls, tenant_id },
    dashboardUser,
  ) {
    this.userId = id;
    this.name = name;
    this.personal_email = personal_email;
    this.contact_email = contact_email;
    this.role_id = Rls.id;
    this.role_name = Rls.name;
    this.tenant_id = tenant_id;
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
