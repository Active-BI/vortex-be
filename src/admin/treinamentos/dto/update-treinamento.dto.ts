import { PartialType } from '@nestjs/swagger';
import { CreateTreinamentoDto } from './create-treinamento.dto';

export class UpdateTreinamentoDto extends PartialType(CreateTreinamentoDto) {}
