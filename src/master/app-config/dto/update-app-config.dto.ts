import { PartialType } from '@nestjs/swagger';
import { CreateAppConfigDto } from './create-app-config.dto';

export class UpdateAppConfigDto extends PartialType(CreateAppConfigDto) {
    logo: string
    bg_image: string
    bg_color: string
}
