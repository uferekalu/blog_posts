/* eslint-disable prettier/prettier */
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
} from '@nestjs/common'
import { PostService } from './posts.service'
import { CreatePostDto } from './dto/createPostDto'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from 'src/auth/decorator/current-user.decorator'
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateCommentDto } from 'src/comment/dto/createCommentDto'
import { CommentService } from 'src/comment/comment.service'
import { diskStorage } from 'multer'
import { Helper } from 'src/utils/helper'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService
  ) {}

  @Get()
  findAll() {
    return this.postService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id)
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: Helper.filePath,
        filename: Helper.customFileName,
      }),
    })
  )
  @UseGuards(JwtAuthGuard)
  async create(
    @Body()
    postData: {
      title: string
      description: string
      categoryId: number
      tagIds: string
    },
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload
  ) {
    console.log('image', file)
    // Check if the user is an admin before allowing post creation
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can create posts')
    }

    return await this.postService.create(
      postData.title,
      postData.description,
      postData.categoryId,
      postData.tagIds,
      file,
      user
    )
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: Helper.filePath,
        filename: Helper.customFileName,
      }),
    })
  )
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body()
    postData: {
      title: string
      description: string
      categoryId: number
      tagIds: string
    },
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload
  ) {
    // Check if the user is an admin before allowing update post
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can update posts')
    }
    return this.postService.update(
      +id,
      postData.title,
      postData.description,
      postData.categoryId,
      postData.tagIds,
      file,
      user
    )
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: string,
    @CurrentUser() user: JwtPayload
  ) {
    // Check if the user is an admin before allowing removal of post
    if (!user.isAdmin) {
      throw new UnauthorizedException('Only admins can delete posts')
    }
    return this.postService.remove(+id)
  }

  @Post(':postId/comment')
  // @UseGuards(JwtAuthGuard)
  makeAComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.commentService.makeAComment(postId, createCommentDto, user)
  }

  @Put(':postId/comment/:commentId')
  editAComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.commentService.editAComment(
      postId,
      commentId,
      createCommentDto,
      user
    )
  }
}
