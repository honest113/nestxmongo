import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/schemas/user.schema';
import { MongoId } from 'src/share/type/common.type';

@Exclude()
export class UpdateUserRequestDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  fullName: string;
}

@Exclude()
export class UserResponseDto {
  @ApiProperty()
  @Expose()
  get id(): string {
    return `${this._id}`;
  }

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  _id: MongoId;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    this._id = partial._id;
  }
}
