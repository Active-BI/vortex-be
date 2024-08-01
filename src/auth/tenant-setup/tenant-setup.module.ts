import { Module } from '@nestjs/common';
import { TenantSetupService } from './tenant-setup.service';
import { TenantSetupController } from './tenant-setup.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [TenantSetupController],
  providers: [TenantSetupService,
    PrismaService],
})
export class TenantSetupModule {}
