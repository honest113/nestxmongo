import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class BaseIdRequestDto {
  @ApiProperty()
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @Min(0)
  @IsNumber()
  @Transform(({ value }) => +value)
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @Max(20)
  @Min(1)
  @IsNumber()
  @Transform(({ value }) => +value)
  @IsOptional()
  limit: number;
}
