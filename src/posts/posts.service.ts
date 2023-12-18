import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/createPostDto';
import { Category } from 'src/entities/category.entity';
import { Tag } from 'src/entities/tag.entity';
import { FileService } from 'src/file/file.service';
import { Comment } from 'src/entities/comment.entity';
import { Like } from 'src/entities/like.entity';
import { Dislike } from 'src/entities/dislike.entity';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Dislike)
    private readonly dislikeRepository: Repository<Dislike>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: FileService,
  ) {}

  async findAll() {
    const data = await this.postRepository.find({
      relations: [
        'category',
        'tags',
        'comments',
        'likes',
        'dislikes',
        'creator',
      ],
    });

    const allData = await Promise.all(
      data.map(async (dt) => {
        const { creator, comments, ...rest } = dt;

        // Fetch comments data concurrently
        const commentsData = await Promise.all(
          comments.map(async (comm) => {
            const { id } = comm;
            const specificComment = await this.commentRepository.findOne({
              where: { id: id },
              relations: ['creator'],
            });
            return specificComment;
          }),
        );

        delete creator.password;
        const result = {
          ...rest, // Include other properties from dt
          creator,
          comments: commentsData,
        };
        return result;
      }),
    );

    return allData;
  }

  async findOne(id: number): Promise<Post> {
    return this.postRepository.findOne({
      where: { id: id },
      relations: ['category', 'tags'],
    });
  }

  async create(
    postDto: CreatePostDto,
    file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ): Promise<Post> {
    const { title, description, categoryId /*tagIds */ } = postDto;
    const existingCategory = await this.categoryRepository.findOne({
      where: { id: parseInt(categoryId) },
    });
    // const existingTags = await this.tagRepository.findBy({
    //   id: In(tagIds.map((id) => id)),
    // });
    const creator = await this.userRepository.findOne({
      where: { id: user?.sub },
    });

    if (!creator) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = {
      title,
      description,
      category: existingCategory,
      // tags: existingTags,
      image: await this.fileService.upload(file),
      creator,
    };
    const post = this.postRepository.create(data);
    return await this.postRepository.save(post);
  }

  async update(
    id: number,
    postDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    const { title, description, categoryId /* tagIds */ } = postDto;
    const existingCategory = await this.categoryRepository.findOne({
      where: { id: parseInt(categoryId) },
    });
    // const existingTags = await this.tagRepository.findBy({
    //   id: In(tagIds.map((id) => id)),
    // });
    const existingPost = await this.postRepository.findOne({
      where: { id: id },
      relations: ['category', 'tags'],
    });
    if (!existingPost) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    const imageUpload = await this.fileService.upload(file);

    // Update post properties
    existingPost.title = title || existingPost.title;
    existingPost.description = description || existingPost.description;
    existingPost.category = existingCategory || existingPost.category;
    existingPost.image = imageUpload || existingPost.image;

    // Update tags by clearing the existing ones and adding the new ones
    // existingPost.tags = existingTags;

    // Save the updated post
    await this.postRepository.save(existingPost);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const existingPost = await this.postRepository.findOne({
      where: { id: id },
      relations: ['category', 'tags'],
    });
    if (!existingPost) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }
    await this.postRepository.delete(id);
  }
}
