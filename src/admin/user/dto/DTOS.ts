import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '@prisma/client';

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
