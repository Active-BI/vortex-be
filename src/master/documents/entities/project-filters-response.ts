import { ApiProperty } from '@nestjs/swagger';

export class ProjectFilterResponse {
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

  @ApiProperty({ nullable: true })
  company_uf: string | null;

  @ApiProperty({ nullable: true })
  company_size: string | null;

  @ApiProperty()
  tenant_color: string;

  @ApiProperty({ nullable: true, type: 'string', format: 'binary' })
  tenant_image: string | null;

  @ApiProperty({ nullable: true })
  company_description: string | null;

  @ApiProperty({ nullable: true })
  company_segment: string | null;

  @ApiProperty()
  restrict: boolean;

  @ApiProperty({ type: [String] })
  projects: string[];
}
