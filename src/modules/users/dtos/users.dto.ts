import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { REGEX_EMAIL } from 'src/constants/regex.constant';

@Exclude()
export class CreateUserRequestDto {
  @Expose()
  @Matches(REGEX_EMAIL, { message: 'Email is invalid!' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  fullName: string;
}
