import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from './user_auth.controller';
import { UserAuthService } from './user_auth.service';

describe('UserAuthController', () => {
  let controller: UserAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [UserAuthService],
    }).compile();

    controller = module.get<UserAuthController>(UserAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
