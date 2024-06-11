import {
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

class DashboardItemDto {
  @IsUUID()
  id: string;
}

export class CreateTenantDto {
  @IsUUID()
  id: string;

  @IsString()
  tenant_name: string;

  @IsString()
  tenant_cnpj: string;

  @IsOptional()
  @IsString()
  company_description?: string;

  @IsOptional()
  @IsString()
  company_segment?: string;

  @IsOptional()
  @IsString()
  company_size?: string;

  @IsOptional()
  @IsString()
  company_uf?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DashboardItemDto)
  dashboard: DashboardItemDto[];

  @IsOptional()
  @IsString()
  tenant_color?: string;

  @IsOptional()
  @IsUrl()
  tenant_image?: string;
}
