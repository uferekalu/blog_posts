import { Module } from '@nestjs/common';
import { DislikeController } from './dislike.controller';
import { DislikeService } from './dislike.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dislike } from 'src/entities/dislike.entity';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Reply } from 'src/entities/reply.entity';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dislike, User, Post, Reply, Comment])],
  controllers: [DislikeController],
  providers: [DislikeService],
})
export class DislikeModule {}
