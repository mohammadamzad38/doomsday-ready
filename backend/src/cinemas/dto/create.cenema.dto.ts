import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCinemaDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(500, { each: true })
  bundleSizes: number[];
}
