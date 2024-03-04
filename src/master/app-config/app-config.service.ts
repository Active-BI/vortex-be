import { Injectable } from '@nestjs/common';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class AppConfigService {
  constructor(private prisma: PrismaService) {

  }
  async findOne() {
    return this.prisma.app.findUnique({
      where: {
        id: 'd25bd198-782b-486f-a9b2-d8a288ab3673'
      }
    })
  }

  async update(updateAppConfigDto: UpdateAppConfigDto) {
    return await this.prisma.app.update({
      where: {
        id: 'd25bd198-782b-486f-a9b2-d8a288ab3673'
      },
      data: {
        ...updateAppConfigDto,
      }
    })
  }
}
