import { Injectable } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  async getPageImage() {
    return await this.prisma.app.findFirst({
      where: {
        id: 'd25bd198-782b-486f-a9b2-d8a288ab3673',
      },
    });
  }
}
