// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { FileService } from 'src/file/file.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: FileService,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async createUser(
    username: string,
    password: string,
    isAdmin: boolean,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = this.userRepository.create({
      username,
      password,
      isAdmin,
      picture: await this.fileService.upload(file),
    });

    await user.hashPassword(); // Hash the password

    return await this.userRepository.save(user);
  }
}
