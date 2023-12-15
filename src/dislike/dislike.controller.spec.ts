import { Test, TestingModule } from '@nestjs/testing';
import { DislikeController } from './dislike.controller';

describe('DislikeController', () => {
  let controller: DislikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DislikeController],
    }).compile();

    controller = module.get<DislikeController>(DislikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
