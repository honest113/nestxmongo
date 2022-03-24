import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { REGEX_EMAIL } from 'src/constants/regex.constant';

export class LoginUserDto {
  @Matches(REGEX_EMAIL, { message: 'Email Is Invalid' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpUserBodyRequestDto {
  @Matches(REGEX_EMAIL, { message: 'Email Is Invalid' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(100)
  @IsString()
  @IsOptional()
  fullName: string;
}
