import { ApiProperty } from '@nestjs/swagger';

export class RequestAdminAccess {
  @ApiProperty({
    required: true,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  company_description: string;
  @ApiProperty({
    required: true,
  })
  company_name: string;
  @ApiProperty({
    required: true,
  })
  company_cnpj: string;
  @ApiProperty({
    required: true,
  })
  email: string;
  @ApiProperty({
    required: true,
  })
  name: string;
  @ApiProperty({
    required: false,
  })
  tenant_id: string;
  @ApiProperty({
    required: true,
  })
  description: string;
  @ApiProperty({
    required: true,
  })
  profession: string;
  @ApiProperty({
    required: false,
  })
  blocked: boolean;
  @ApiProperty({
    required: false,
  })
  accept: boolean;
}
export class Token {
  @ApiProperty({
    required: true,
  })
  token: string;
}
