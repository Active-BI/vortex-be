import { Test, TestingModule } from '@nestjs/testing';
import { PbiReportService } from './pbi-report.service';

describe('PbiReportService', () => {
  let service: PbiReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PbiReportService],
    }).compile();

    service = module.get<PbiReportService>(PbiReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
