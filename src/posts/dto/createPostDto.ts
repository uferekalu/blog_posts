/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  // @IsArray()
  // @IsInt({ each: true })
  // tagIds: number[];
}
