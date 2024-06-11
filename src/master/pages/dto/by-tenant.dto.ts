import { ApiProperty } from '@nestjs/swagger';

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

export class ByTenantPageResponse {
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

  @ApiProperty({ example: '6efe988a-2e09-4cfb-ae4c-8de4ae58d275' })
  group_id: string;

  @ApiProperty({ example: '0cafa534-6e24-45e3-8ffe-ae39d98c7695' })
  report_id: string;

  @ApiProperty({ example: false })
  possui_dados_sensiveis: boolean;

  @ApiProperty({ example: false })
  restrict: boolean;

  @ApiProperty({ example: '' })
  table_name: string;

  @ApiProperty({ example: '9b0e8176-5c8d-4024-ac28-524ba48d16c9' })
  page_group_id: string;

  @ApiProperty({ type: PageGroupDto })
  Page_Group: PageGroupDto;

  @ApiProperty({ example: ['Admin', 'User'] })
  Page_Role: string[];

  @ApiProperty({ type: [TenantDto] })
  Tenant_Page: TenantDto[];
}
