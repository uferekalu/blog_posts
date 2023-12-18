// auth.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(
    @Body() userData: { username: string; password: string },
  ): Promise<{ accessToken: string }> {
    console.log('Request payload:', userData);
    const user = await this.authService.validateUser(
      userData.username,
      userData.password,
    );

    console.log('validated user', user);

    if (!user) {
      return { accessToken: null };
    }

    const accessToken = await this.authService.generateToken(user);
    return { accessToken };
  }
}
