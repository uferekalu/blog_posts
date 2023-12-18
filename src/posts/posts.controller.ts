import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Injectable,
  UseGuards,
  UnauthorizedException,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/createPostDto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from 'src/comment/dto/createCommentDto';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() postDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    // Check if the user is an admin before allowing post creation
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can create posts');
    }
    return await this.postService.create(postDto, file, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() postDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    // Check if the user is an admin before allowing update post
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can update posts');
    }
    return this.postService.update(+id, postDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    // Check if the user is an admin before allowing removal of post
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can delete posts');
    }
    return this.postService.remove(+id);
  }

  @Post(':postId/comment')
  // @UseGuards(JwtAuthGuard)
  makeAComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.commentService.makeAComment(postId, createCommentDto, user);
  }
}
