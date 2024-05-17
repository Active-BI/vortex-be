import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TfaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pin: string;
}
