import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/schemas/user.schema';
import { MongoId } from 'src/share/type/common.type';

@Exclude()
class UserAddress {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  street: string;
}

@Exclude()
export class UpdateUserRequestDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ type: UserAddress })
  @Expose()
  @Type(() => UserAddress)
  address: UserAddress;
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

  @ApiProperty({ type: UserAddress })
  @Expose()
  @Type(() => UserAddress)
  address: UserAddress;

  _id: MongoId;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    this._id = partial._id;
  }
}
