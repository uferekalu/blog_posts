import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Dislike } from 'src/entities/dislike.entity';
import { Like } from 'src/entities/like.entity';
import { Post } from 'src/entities/post.entity';
import { Reply } from 'src/entities/reply.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createCommentDto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Dislike)
    private readonly dislikeRepository: Repository<Dislike>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOne({
      where: { id: id },
      relations: ['post', 'replies', 'likes', 'dislikes', 'creator'],
    });
  }

  async makeAComment(
    postId: number,
    createCommentDto: CreateCommentDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    const creator = await this.userRepository.findOne({
      where: { id: user?.sub },
    });
    const { content } = createCommentDto;
    console.log('content', content);
    if (!post) {
      throw new HttpException(
        {
          message: 'Post not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const comment = this.commentRepository.create({
      text: content,
      post,
      creator,
    });

    return await this.commentRepository.save(comment);
  }
}
