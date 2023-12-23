/* eslint-disable prettier/prettier */
// src/services/category.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/createCategoryDto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['posts'] });
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id: id },
      relations: ['posts'],
    });
  }

  async create(categoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(categoryDto);
    return this.categoryRepository.save(category);
  }

  async update(id: number, categoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!existingCategory) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }
    // Update category properties
    existingCategory.name = categoryDto.name || existingCategory.name;

    // Save the updated post
    await this.categoryRepository.save(existingCategory);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!existingCategory) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }
    await this.categoryRepository.delete(id);
  }
}
