import { ApiProperty } from '@nestjs/swagger';
import { Rls, User } from '@prisma/client';

class TenantName {
  @ApiProperty()
  tenant_name: string;
}
class RlsClass implements Rls {
  @ApiProperty({})
  id: string;
  @ApiProperty({})
  name: string;
}
class UserAuthLastAcess {
  @ApiProperty()
  last_access: Date;
}

export class UserResponse implements User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  born_date: Date;
  @ApiProperty()
  contact_email: string;
  @ApiProperty()
  tenant_id: string;
  @ApiProperty()
  rls_id: string;
  @ApiProperty()
  office_id: string;
  @ApiProperty()
  projects: string[];
  @ApiProperty()
  Rls: RlsClass;
  @ApiProperty()
  User_Auth: UserAuthLastAcess;
  @ApiProperty()
  Tenant: TenantName;
}
