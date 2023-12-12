import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/createPostDto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['category', 'tags'] });
  }

  async findOne(id: number): Promise<Post> {
    return this.postRepository.findOne({
      where: { id: id },
      relations: ['category', 'tags'],
    });
  }

  async create(postDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(postDto);
    return this.postRepository.save(post);
  }

  async update(id: number, postDto: CreatePostDto): Promise<Post> {
    await this.postRepository.update(id, postDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
