import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  // @IsNotEmpty()
  // tenant_id?: string;
}
