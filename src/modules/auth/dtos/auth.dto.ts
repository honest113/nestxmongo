import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { REGEX_EMAIL } from 'src/constants/regex.constant';

export class LoginUserDto {
  @ApiProperty()
  @Matches(REGEX_EMAIL, { message: 'Email Is Invalid' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpUserBodyRequestDto {
  @ApiProperty()
  @Matches(REGEX_EMAIL, { message: 'Email Is Invalid' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  @MaxLength(100)
  @IsString()
  @IsOptional()
  fullName: string;
}
