/* eslint-disable prettier/prettier */
import { Category } from 'src/entities/category.entity';
import { Dislike } from 'src/entities/dislike.entity';
import { Like } from 'src/entities/like.entity';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';

export interface AllPostInterface {
  creator: User;
  comments: Comment[];
  id: number;
  title: string;
  description: string;
  image: string;
  category: Category;
  tags: Tag[];
  likes: Like[];
  dislikes: Dislike[];
  createdAt: Date;
  updatedAt: Date;
}
