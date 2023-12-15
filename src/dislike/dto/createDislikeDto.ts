/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateDislikeDto {
  @IsInt()
  @IsNotEmpty()
  entityId: number; // Id of the post, reply, or comment

  @IsString()
  @IsNotEmpty()
  entityType: 'post' | 'reply' | 'comment'; // Type of entity (post, reply, or comment)
}
