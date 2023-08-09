import { Test, TestingModule } from '@nestjs/testing';
import { MasterRequestService } from './admin-request.service';

describe('AdminRequestService', () => {
  let service: MasterRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterRequestService],
    }).compile();

    service = module.get<MasterRequestService>(MasterRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
