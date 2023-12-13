// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
  ): Promise<User> {
    const user = this.userRepository.create({
      username,
      password,
      isAdmin,
    });
    await user.hashPassword(); // Hash the password
    return this.userRepository.save(user);
  }
}
