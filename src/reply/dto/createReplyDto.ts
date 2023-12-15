/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  commentId: number;
}
