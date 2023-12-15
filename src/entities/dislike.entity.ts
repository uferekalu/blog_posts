/* eslint-disable prettier/prettier */
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Reply } from './reply.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Dislike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, (comment) => comment.dislikes)
  comment: Comment;

  @ManyToOne(() => Reply, (reply) => reply.dislikes)
  reply: Reply;

  @ManyToOne(() => Post, (post) => post.dislikes)
  post: Post;

  @ManyToOne(() => User, (user) => user.dislikes)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
