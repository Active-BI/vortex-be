// src/user/dto/tenant.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

class RlsDto {
  @ApiProperty({ example: '6a203390-8389-49ca-aa0e-6a14ba7815bc' })
  id: string;

  @ApiProperty({ example: 'Admin' })
  name: string;
}

class TenantDto {
  @ApiProperty({ example: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19' })
  id: string;

  @ApiProperty({ example: 'Tenant 1' })
  tenant_name: string;

  @ApiProperty({ example: '000000000000-11' })
  tenant_cnpj: string;

  @ApiProperty({ example: '2024-05-31T17:46:22.667Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-05-31T17:46:22.667Z' })
  updatedAt: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: null, nullable: true })
  company_uf: string | null;

  @ApiProperty({ example: null, nullable: true })
  company_size: string | null;

  @ApiProperty({ example: '#ffffff' })
  tenant_color: string;

  @ApiProperty({ example: null, nullable: true })
  tenant_image: string | null;

  @ApiProperty({ example: null, nullable: true })
  company_description: string | null;

  @ApiProperty({ example: null, nullable: true })
  company_segment: string | null;

  @ApiProperty({ example: false })
  restrict: boolean;
}

class PageGroupDto {
  @ApiProperty({ example: '9b0e8176-5c8d-4024-ac28-524ba48d16c9' })
  id: string;

  @ApiProperty({ example: 'Gestão Cliente' })
  title: string;

  @ApiProperty({ example: 'gestao-cliente' })
  formated_title: string;

  @ApiProperty({ example: false })
  restrict: boolean;

  @ApiProperty({ example: 'mat_outline:people_alt' })
  icon: string;
}

class PageDto {
  @ApiProperty({ example: '9a7dc980-cc5f-4060-a111-e006d62e5f18' })
  id: string;

  @ApiProperty({ example: 'basic' })
  type: string;

  @ApiProperty({ example: 'report' })
  page_type: string;

  @ApiProperty({ example: 'zoho' })
  formated_title: string;

  @ApiProperty({ example: 'Zoho' })
  title: string;

  @ApiProperty({ example: null, nullable: true })
  descricao_painel: string | null;

  @ApiProperty({ example: null, nullable: true })
  nome_responsavel: string | null;

  @ApiProperty({ example: null, nullable: true })
  email_responsavel: string | null;

  @ApiProperty({ example: 'view-report/gestao-cliente/zoho' })
  link: string;

  @ApiProperty({
    example: '6efe988a-2e09-4cfb-ae4c-8de4ae58d275',
    nullable: true,
  })
  group_id: string | null;

  @ApiProperty({
    example: '0cafa534-6e24-45e3-8ffe-ae39d98c7695',
    nullable: true,
  })
  report_id: string | null;

  @ApiProperty({ example: false })
  possui_dados_sensiveis: boolean;

  @ApiProperty({ example: false })
  restrict: boolean;

  @ApiProperty({ example: '', nullable: true })
  table_name: string | null;

  @ApiProperty({ example: '9b0e8176-5c8d-4024-ac28-524ba48d16c9' })
  page_group_id: string;

  @ApiProperty({ type: PageGroupDto })
  Page_Group: PageGroupDto;
}

class DashboardDto {
  @ApiProperty({ example: '5c96a436-c455-49e1-a12d-42bf5e86edf6' })
  id: string;

  @ApiProperty({ example: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19' })
  tenant_id: string;

  @ApiProperty({ example: '9a7dc980-cc5f-4060-a111-e006d62e5f18' })
  page_id: string;

  @ApiProperty({ type: PageDto })
  Page: PageDto;

  @ApiProperty({ example: false })
  included: boolean;
}

export class UserTenantResponse {
  @ApiProperty({ example: 'Luiz' })
  name: string;

  @ApiProperty({ example: 'luiz@activebi.com.br' })
  contact_email: string;

  @ApiProperty({ example: '18da15ab-ae39-4b1c-98e9-0e0859556396' })
  id: string;

  @ApiProperty({ type: RlsDto })
  Rls: RlsDto;

  @ApiProperty({ type: [Object], example: [] })
  projects: any[];

  @ApiProperty({ type: TenantDto })
  Tenant: TenantDto;

  @ApiProperty({ example: null, nullable: true })
  last_access: string | null;

  @ApiProperty({ type: [DashboardDto] })
  dashboards: DashboardDto[];
}

export class CreatePageUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  projetos: string[];
}
