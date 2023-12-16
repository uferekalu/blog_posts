import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { FileService } from 'src/file/file.service';
import { Like } from 'src/entities/like.entity';
import { Dislike } from 'src/entities/dislike.entity';
import { Post } from 'src/entities/post.entity';
import { Reply } from 'src/entities/reply.entity';
import { Comment } from 'src/entities/comment.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Like, Dislike, Comment, Reply]),
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService, FileService],
  exports: [UserService],
})
export class UserModule {}
