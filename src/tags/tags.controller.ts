/* eslint-disable prettier/prettier */
// src/controllers/tag.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { TagService } from './tags.service';
import { CreateTagDto } from './dto/createTagDto';
import { JwtAuthGuard } from 'src/posts/posts.controller';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

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
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() tagDto: CreateTagDto, @CurrentUser() user: JwtPayload) {
    // Check if the user is an admin before allowing category creation
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can create tags');
    }
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
