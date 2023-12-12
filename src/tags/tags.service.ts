import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from './dto/createTagDto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({ relations: ['posts'] });
  }

  async findOne(id: number): Promise<Tag> {
    return this.tagRepository.findOne({
      where: { id: id },
      relations: ['posts'],
    });
  }

  async create(tagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(tagDto);
    return this.tagRepository.save(tag);
  }

  async update(id: number, tagDto: CreateTagDto): Promise<Tag> {
    await this.tagRepository.update(id, tagDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
