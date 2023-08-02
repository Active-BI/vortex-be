import { ApiProperty } from '@nestjs/swagger';

export class CreateLoginDto {
  @ApiProperty({
    required: true,
  })
  email: string;
  @ApiProperty({
    required: true,
  })
  password: string;
}
export class Token {
  @ApiProperty({
    required: true,
  })
  token: string;
}
