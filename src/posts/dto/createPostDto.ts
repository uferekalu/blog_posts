/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsArray()
  @IsInt({ each: true })
  tagIds: number[];
}
