import { Test, TestingModule } from '@nestjs/testing';
import { AdminRequestController } from './admin-request.controller';
import { AdminRequestService } from './admin-request.service';

describe('AdminRequestController', () => {
  let controller: AdminRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminRequestController],
      providers: [AdminRequestService],
    }).compile();

    controller = module.get<AdminRequestController>(AdminRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
