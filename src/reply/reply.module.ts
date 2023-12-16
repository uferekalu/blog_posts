import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from 'src/entities/reply.entity';
import { Like } from 'src/entities/like.entity';
import { Dislike } from 'src/entities/dislike.entity';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Comment, Like, Dislike])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
