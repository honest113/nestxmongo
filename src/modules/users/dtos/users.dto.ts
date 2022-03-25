import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { REGEX_EMAIL } from 'src/constants/regex.constant';

@Exclude()
export class UpdateUserRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  fullName: string;
}
