import { Test, TestingModule } from '@nestjs/testing';
import { PbiReportController } from './pbi-report.controller';
import { PbiReportService } from './pbi-report.service';

describe('PbiReportController', () => {
  let controller: PbiReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PbiReportController],
      providers: [PbiReportService],
    }).compile();

    controller = module.get<PbiReportController>(PbiReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
