/* eslint-disable prettier/prettier */
// src/controllers/category.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/createCategoryDto';
import { JwtAuthGuard } from 'src/posts/posts.controller';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() categoryDto: CreateCategoryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    // Check if the user is an admin before allowing category creation
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can create categories');
    }
    return this.categoryService.create(categoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() categoryDto: CreateCategoryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    // Check if the user is an admin before allowing category update
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can update categories');
    }
    return this.categoryService.update(+id, categoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    // Check if the user is an admin before allowing category removal
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can delete categories');
    }
    return this.categoryService.remove(+id);
  }
}
