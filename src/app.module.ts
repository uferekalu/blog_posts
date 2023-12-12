// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { Category } from './entities/category.entity';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'INTELLIGENTgoodnews1234@@',
      database: 'blog_post',
      entities: [Post, Tag, Category],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Post, Tag, Category]),
    PostsModule,
    CategoriesModule,
    TagsModule,
  ],
})
export class AppModule {}
