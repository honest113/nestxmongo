import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserResponseDto } from 'src/modules/users/dtos/users.dto';
import { Post } from 'src/schemas/post.schema';
import { MongoId } from 'src/share/type/common.type';

@Exclude()
export class CreatePostRequestDto {
  @ApiProperty()
  @Expose()
  @MaxLength(150)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value.toString().trim())
  @IsString()
  @IsNotEmpty()
  content: string;
}

@Exclude()
export class ListPostDataResponseDto {
  @ApiProperty({ type: String })
  @Expose()
  @Transform(({ value }) => value.toString())
  id: MongoId;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => new UserResponseDto(value))
  author: UserResponseDto;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
    this.id = partial._id;
  }
}
