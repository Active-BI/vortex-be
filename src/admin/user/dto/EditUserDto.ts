import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserBody } from './CreateUserDto';
import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EditUserBody extends OmitType(CreateUserBody, ['email'] as const) {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
