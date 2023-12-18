import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Dislike } from 'src/entities/dislike.entity';
import { Post } from 'src/entities/post.entity';
import { Reply } from 'src/entities/reply.entity';
import { Like } from 'src/entities/like.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Dislike, Like, Post, Reply, User]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
