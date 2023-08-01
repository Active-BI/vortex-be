import { PartialType } from '@nestjs/swagger';
import { CreateAdminRequestDto } from './create-admin-request.dto';

export class UpdateAdminRequestDto extends PartialType(CreateAdminRequestDto) {}
