import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Category } from 'src/entities/category.entity';
import { Tag } from 'src/entities/tag.entity';
import { FileService } from 'src/file/file.service';
import { Comment } from 'src/entities/comment.entity';
import { Like } from 'src/entities/like.entity';
import { Dislike } from 'src/entities/dislike.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Tag, Comment, Like, Dislike]),
  ],
  controllers: [PostController],
  providers: [PostService, FileService],
})
export class PostsModule {}
