import { Module } from '@nestjs/common';
import { TreinamentosService } from './treinamentos.service';
import { TreinamentosController } from './treinamentos.controller';

@Module({
  controllers: [TreinamentosController],
  providers: [TreinamentosService],
})
export class TreinamentosModule {}
