// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async validateAdmin(userId: number): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (user) {
      return user.isAdmin === true;
    }
    return false;
  }

  async generateToken(user: any): Promise<string> {
    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      picture: user.picture,
    });
  }
}
