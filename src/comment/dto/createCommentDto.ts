/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  // @IsInt()
  // @IsNotEmpty()
  // postId: number;
}
