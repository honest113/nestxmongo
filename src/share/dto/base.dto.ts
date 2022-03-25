import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class BaseIdRequestDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  id: string;
}
