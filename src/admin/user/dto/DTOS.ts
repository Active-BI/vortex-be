import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Rls, Tenant, User, User_Auth } from '@prisma/client';
import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  company_uf: string;
  @ApiProperty()
  company_size: string;
  @ApiProperty()
  company_segment: string;
  @ApiProperty()
  company_description;
  @ApiProperty()
  id: string;
  @ApiProperty()
  tenant_name: string;
  @ApiProperty()
  tenant_image: string;
  @ApiProperty()
  tenant_color: string;
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
class TenantName {
  @ApiProperty()
  tenant_name: string;
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
  // @ApiProperty()
  // User_Auth: any;
  @ApiProperty()
  Tenant: TenantName;
}

export class CreateUserBody {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  office_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rls_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  projects: string[];

  // @ApiProperty()
  // profession: string;
  // @ApiProperty()
  // description: string;
  @ApiProperty()
  @IsNotEmpty()
  tenant_id: string;
}
export class EditUserBody extends PartialType(
  OmitType(CreateUserBody, ['email'] as const),
) {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
export class Token {
  @ApiProperty({
    required: true,
  })
  token: string;
}
