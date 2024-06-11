import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

class PageGroupDto {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  formated_title: string;

  @ApiProperty()
  @IsBoolean()
  restrict: boolean;

  @ApiProperty()
  @IsString()
  icon: string;
}

class RoleDto {
  @ApiProperty()
  @IsString()
  name: string;
}

class PageRoleDto {
  @ApiProperty({ type: RoleDto })
  Rls: RoleDto;
}

class TenantDto {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  tenant_name: string;

  @ApiProperty()
  @IsString()
  tenant_cnpj: string;

  @ApiProperty()
  @IsString()
  createdAt: string;

  @ApiProperty()
  @IsString()
  updatedAt: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company_uf?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company_size?: string | null;

  @ApiProperty()
  @IsString()
  tenant_color: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenant_image?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company_description?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company_segment?: string | null;

  @ApiProperty()
  @IsBoolean()
  restrict: boolean;
}

class TenantPageDto {
  @ApiProperty({ type: TenantDto })
  Tenant: TenantDto;
}

export class PageResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  page_type: string;

  @ApiProperty()
  @IsString()
  formated_title: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descricao_painel?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nome_responsavel?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email_responsavel?: string | null;

  @ApiProperty()
  @IsString()
  link: string;

  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  group_id: string;

  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  report_id: string;

  @ApiProperty()
  @IsBoolean()
  possui_dados_sensiveis: boolean;

  @ApiProperty()
  @IsBoolean()
  restrict: boolean;

  @ApiProperty()
  @IsString()
  table_name: string;

  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  page_group_id: string;

  @ApiProperty({ type: PageGroupDto })
  Page_Group: PageGroupDto;

  @ApiProperty({ type: [PageRoleDto] })
  Page_Role: PageRoleDto[];

  @ApiProperty({ type: [TenantPageDto] })
  Tenant_Page: TenantPageDto[];
}
