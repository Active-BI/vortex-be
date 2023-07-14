export class Token {
  userId: string;
  name: string;
  tenant_id: string;
  email_active: string;
  email: string;
  status: string;
  role_id: string;
  role: string;
  constructor(userId, name, email, status, role_id, role, tenant_id) {
    this.userId = userId;
    this.name = name;
    this.email_active = email;
    this.email = email;
    this.status = status;
    this.role_id = role_id;
    this.tenant_id = tenant_id;
    this.role = role;
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
