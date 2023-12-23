/* eslint-disable prettier/prettier */
// auth.service.ts
import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { HttpStatus } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username)

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (isPasswordValid) {
        return user
      } else {
        throw new HttpException(
          {
            error: 'Invalid password',
          },
          HttpStatus.BAD_REQUEST
        )
      }
    } else {
      throw new HttpException(
        {
          error: 'User not found in database',
        },
        HttpStatus.BAD_REQUEST
      )
    }

    return null
  }

  async validateAdmin(userId: number): Promise<boolean> {
    const user = await this.userService.findById(userId)
    if (user) {
      return user.isAdmin === true
    }
    return false
  }

  async generateToken(user: any): Promise<string> {
    // Set the expiration time to 1 day
    const expiresIn = '1d'

    const token = this.jwtService.sign(
      {
        sub: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        picture: user.picture,
      },
      { expiresIn } // Include expiresIn option
    )

    return token
  }
}
