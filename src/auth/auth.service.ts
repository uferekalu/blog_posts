// auth.service.ts
import { HttpException, Injectable } from '@nestjs/common';
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

    if (user) {
      console.log('User found in database:', user);

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        console.log('Password is valid');
        return user;
      } else {
        console.log('Invalid password');
      }
    } else {
      console.log('User not found in database');
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
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      picture: user.picture,
    });

    console.log('Generated token:', token);

    return token;
  }
}
