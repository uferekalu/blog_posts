// src/controllers/tag.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TagService } from './tags.service';
import { CreateTagDto } from './dto/createTagDto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @Post()
  create(@Body() tagDto: CreateTagDto) {
    return this.tagService.create(tagDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() tagDto: CreateTagDto) {
    return this.tagService.update(+id, tagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
