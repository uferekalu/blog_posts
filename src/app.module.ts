/* eslint-disable prettier/prettier */
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { Category } from './entities/category.entity';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';
import { LikeModule } from './like/like.module';
import { DislikeModule } from './dislike/dislike.module';
import { FileService } from './file/file.service';
import { Like } from './entities/like.entity';
import { Dislike } from './entities/dislike.entity';
import { Comment } from './entities/comment.entity';
import { Reply } from './entities/reply.entity';
import { LocalStrategy } from './auth/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make sure to make the module global
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Post, Tag, Category, User, Like, Dislike, Comment, Reply],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Post,
      Tag,
      Category,
      User,
      Like,
      Dislike,
      Comment,
      Reply,
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    PostsModule,
    CategoriesModule,
    TagsModule,
    AuthModule,
    UserModule,
    CommentModule,
    ReplyModule,
    LikeModule,
    DislikeModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [
    AppService,
    UserService,
    AuthService,
    JwtStrategy,
    FileService,
    LocalStrategy,
  ],
})
export class AppModule {}
