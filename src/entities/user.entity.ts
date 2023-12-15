/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Like } from './like.entity';
import { Dislike } from './dislike.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Reply } from './reply.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
  
  @OneToMany(() => Dislike, (dislike) => dislike.user)
  dislikes: Dislike[];

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];
  
  @OneToMany(() => Comment, (comment) => comment.creator)
  comments: Comment[];
  
  @OneToMany(() => Reply, (reply) => reply.creator)
  replies: Reply[];

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
