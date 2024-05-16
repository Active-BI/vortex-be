import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserBody } from './CreateUserDto';
import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EditUserBody {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

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
  // profession: string;
  // @ApiProperty()
  // description: string;
}
