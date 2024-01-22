import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { PrismaService } from 'src/services/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class OfficeService {
  constructor(private prisma: PrismaService) {}
  async findAll(tenant_id) {
    return await this.prisma.office.findMany({
      where: {
        tenant_id
      }
    });
  }

  async findOne(id: string,tenant_id) {
    return await this.prisma.office.findFirst({
      where: {
        id,
        AND: {
          tenant_id
        }
      },
    });
  }

  async upsert(updateOfficeDto: UpdateOfficeDto,tenant_id) {
 
    const name = await this.prisma.office.findFirst({
      where: {
        name:updateOfficeDto.name,
        AND: {
          tenant_id
        }
      },
      
    })
    if (name) {
      throw new BadRequestException('Cargo já cadastrado')
    }
    if (updateOfficeDto.id === null ||   updateOfficeDto.id === '') {
      updateOfficeDto.id = randomUUID()
    }
    return await this.prisma.office.upsert({
      where: {
        id: updateOfficeDto.id
      },
      update: updateOfficeDto,
      create: {...updateOfficeDto, tenant_id},
    });
  }

  async remove(id: string,tenant_id) {
    return await this.prisma.office.delete({
      where: {
        id,
        AND: {
          tenant_id
        }
      },
    });
  }
}
