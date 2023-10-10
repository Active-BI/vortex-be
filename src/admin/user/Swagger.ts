import { ApiProperty } from '@nestjs/swagger';
import { Rls, Tenant, User, User_Auth } from '@prisma/client';

export class CreateUserResponse {
  @ApiProperty({})
  user_id: string;
}
class RlsClass implements Rls {
  @ApiProperty({})
  id: string;
  @ApiProperty({})
  name: string;
}

export class TenantClass implements Tenant {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tenant_name: string;
  @ApiProperty()
  tenant_cnpj: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  restrict: boolean;
}

class UserAuthClass implements User_Auth {
  @ApiProperty()
  id: string;
  @ApiProperty()
  secret: string;
  @ApiProperty()
  reset_pass: string;
  @ApiProperty()
  password_hash: string;
  @ApiProperty()
  anchor: boolean;
  @ApiProperty()
  normalized_contact_email: string;
  @ApiProperty()
  last_access: Date;
  @ApiProperty()
  user_id: string;
}

export class UserResponse implements User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  born_date: Date;
  @ApiProperty()
  personal_email: string;
  @ApiProperty()
  contact_email: string;

  @ApiProperty()
  description: string;
  @ApiProperty()
  tenant_id: string;
  @ApiProperty()
  rls_id: string;

  @ApiProperty()
  Rls: RlsClass;
  @ApiProperty()
  User_Auth: UserAuthClass;
  @ApiProperty()
  Tenant: TenantClass;
}
export class CreateUserBody {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  profession: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  tenant_id: string;
  @ApiProperty()
  rls_id: string;
}
export class EditUserBody extends CreateUserBody {
  @ApiProperty()
  id: string;
}
export class Token {
  @ApiProperty({
    required: true,
  })
  token: string;
}
