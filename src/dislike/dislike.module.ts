import { Module } from '@nestjs/common';
import { DislikeController } from './dislike.controller';
import { DislikeService } from './dislike.service';

@Module({
  controllers: [DislikeController],
  providers: [DislikeService]
})
export class DislikeModule {}
