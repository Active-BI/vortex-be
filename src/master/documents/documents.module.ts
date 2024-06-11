import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { PrismaService } from 'src/services/prisma.service';
import { DocumentsService } from './documents.service';
import { DomcumentsRepository } from './documents.repository';

@Module({
  controllers: [DocumentsController],
  providers: [DomcumentsRepository, DocumentsService, PrismaService],
})
export class DocumentsModule {}
