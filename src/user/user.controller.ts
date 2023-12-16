// user.controller.ts
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('signup')
  async signup(
    @Body() userData: { username: string; password: string; isAdmin: boolean },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    console.log(file);
    const existingUser = await this.userService.findByUsername(
      userData.username,
    );

    if (existingUser) {
      throw new UnauthorizedException('Username is already taken');
    }

    await this.userService.createUser(
      userData.username,
      userData.password,
      userData.isAdmin,
      file,
    );
    return { message: 'User registered successfully' };
  }
}
