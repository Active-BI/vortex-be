import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdatePagesDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  DashboardUserList: string[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  projetos: string[];
}
