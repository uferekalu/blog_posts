// user.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body() userData: { username: string; password: string; isAdmin: boolean },
  ): Promise<{ message: string }> {
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
    );
    return { message: 'User registered successfully' };
  }
}
